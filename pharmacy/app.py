import os
import sys
import random
import string
from functools import wraps
from datetime import datetime

# إعداد مخرجات التيرمينال لتدعم ترميز UTF-8 على ويندوز
if sys.platform.startswith('win'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
from flask import (
    Flask, request, jsonify, render_template, 
    send_from_directory, session, redirect, url_for
)
from flask_cors import CORS
from werkzeug.security import check_password_hash
from werkzeug.utils import secure_filename

from config import Config
from database import init_db, SessionLocal
from models import (
    User, Role, Category, Medicine, Order, 
    OrderItem, Prescription, AuditLog
)

app = Flask(
    __name__,
    static_folder='static',
    template_folder='templates'
)
app.config.from_object(Config)
CORS(app, supports_credentials=True)

# تأكد من وجود مجلد رفع الروشتات
os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)

# تهيئة قاعدة البيانات عند بدء التشغيل
with app.app_context():
    init_db()

# ================= Middleware & Security Decorators =================
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Unauthorized', 'message': 'يجب تسجيل الدخول أولاً'}), 401
        return f(*args, **kwargs)
    return decorated_function

def role_required(allowed_roles):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if 'user_id' not in session:
                return jsonify({'error': 'Unauthorized', 'message': 'يجب تسجيل الدخول أولاً'}), 401
            user_role = session.get('role')
            if user_role not in allowed_roles:
                return jsonify({'error': 'Forbidden', 'message': 'ليس لديك صلاحية لتنفيذ هذا الإجراء'}), 403
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def log_audit(db, action, entity_name, entity_id=None, details=None):
    """تسجيل العمليات في سجل الرقابة والحماية"""
    try:
        log = AuditLog(
            user_id=session.get('user_id'),
            username=session.get('username', 'زائر'),
            action=action,
            entity_name=entity_name,
            entity_id=str(entity_id) if entity_id else None,
            details=details,
            ip_address=request.remote_addr
        )
        db.add(log)
        db.commit()
    except Exception as e:
        print(f"Failed to write audit log: {e}")

# ================= Web Pages Routes =================
@app.route('/')
def home():
    """الصفحة الرئيسية للمتجر والصيدلية"""
    return render_template('index.html')

@app.route('/login')
def login_page():
    """صفحة تسجيل الدخول الآمن للإدارة والصيادلة"""
    if 'user_id' in session:
        return redirect(url_for('admin_dashboard'))
    return render_template('login.html')

@app.route('/admin')
def admin_dashboard():
    """لوحة تحكم الصيدلية المشتركة (مدير + صيدلي)"""
    if 'user_id' not in session:
        return redirect(url_for('login_page'))
    return render_template('admin.html', user=session)

# ================= Authentication API =================
@app.route('/api/auth/login', methods=['POST'])
def api_login():
    data = request.get_json() or {}
    username = data.get('username', '').strip()
    password = data.get('password', '').strip()

    if not username or not password:
        return jsonify({'error': 'Bad Request', 'message': 'يرجى إدخال اسم المستخدم وكلمة المرور'}), 400

    db = SessionLocal()
    try:
        user = db.query(User).filter_by(username=username).first()
        if not user or not check_password_hash(user.password_hash, password):
            return jsonify({'error': 'Unauthorized', 'message': 'اسم المستخدم أو كلمة المرور غير صحيحة'}), 401

        if not user.is_active:
            return jsonify({'error': 'Forbidden', 'message': 'هذا الحساب معطل حالياً'}), 403

        # تحديث وقت آخر تسجيل دخول
        user.last_login = datetime.utcnow()
        db.commit()

        # إنشاء جلسة آمنة
        session['user_id'] = user.user_id
        session['username'] = user.username
        session['full_name'] = user.full_name
        session['role'] = user.role.role_name
        session['role_display'] = user.role.display_name

        log_audit(db, 'LOGIN', 'Users', user.user_id, f'تسجيل دخول ناجح للمستخدم: {username}')

        return jsonify({
            'success': True,
            'message': f'مرحباً بك د. {user.full_name}',
            'user': user.to_dict()
        })
    finally:
        db.close()

@app.route('/api/auth/logout', methods=['POST'])
def api_logout():
    db = SessionLocal()
    try:
        log_audit(db, 'LOGOUT', 'Users', session.get('user_id'), 'تسجيل خروج')
        session.clear()
        return jsonify({'success': True, 'message': 'تم تسجيل الخروج بنجاح'})
    finally:
        db.close()

@app.route('/api/auth/me', methods=['GET'])
def api_me():
    if 'user_id' not in session:
        return jsonify({'authenticated': False}), 200

    db = SessionLocal()
    try:
        user = db.query(User).get(session['user_id'])
        if not user:
            session.clear()
            return jsonify({'authenticated': False}), 200
        return jsonify({'authenticated': True, 'user': user.to_dict()})
    finally:
        db.close()

# ================= Products (Medicines) API =================
@app.route('/api/products', methods=['GET'])
def get_products():
    category = request.args.get('category')
    search = request.args.get('search')
    otc_only = request.args.get('otc') == 'true'

    db = SessionLocal()
    try:
        query = db.query(Medicine).filter_by(is_active=True)

        if category and category != 'all':
            query = query.filter_by(category_id=category)

        if otc_only:
            query = query.filter_by(requires_prescription=False)

        if search:
            search_term = f"%{search}%"
            query = query.filter(
                (Medicine.name_ar.ilike(search_term)) |
                (Medicine.name_en.ilike(search_term)) |
                (Medicine.active_ingredient.ilike(search_term)) |
                (Medicine.indications.ilike(search_term))
            )

        products = query.all()
        return jsonify([p.to_dict() for p in products])
    finally:
        db.close()

@app.route('/api/products/<medicine_id>', methods=['GET'])
def get_product(medicine_id):
    db = SessionLocal()
    try:
        p = db.query(Medicine).get(medicine_id)
        if not p:
            return jsonify({'error': 'Not Found', 'message': 'الدواء غير موجود'}), 404
        return jsonify(p.to_dict())
    finally:
        db.close()

@app.route('/api/products', methods=['POST'])
@login_required
@role_required(['admin']) # المدير العام فقط يضيف أدوية جديدة
def add_product():
    data = request.get_json() or {}
    db = SessionLocal()
    try:
        med_id = data.get('id') or f"med-{random.randint(100, 999)}"
        existing = db.query(Medicine).get(med_id)
        if existing:
            return jsonify({'error': 'Conflict', 'message': 'رمز الدواء موجود بالفعل'}), 409

        med = Medicine(
            medicine_id=med_id,
            name_ar=data['name'],
            name_en=data.get('nameEn', data['name']),
            category_id=data['category'],
            active_ingredient=data['activeIngredient'],
            form=data['form'],
            price=float(data['price']),
            old_price=float(data['oldPrice']) if data.get('oldPrice') else None,
            requires_prescription=bool(data.get('prescription', False)),
            stock_count=int(data.get('stockCount', 50)),
            rating=float(data.get('rating', 5.0)),
            reviews_count=int(data.get('reviewsCount', 0)),
            badge=data.get('badge'),
            badge_type=data.get('badgeType', 'normal'),
            indications=data['indications'],
            dosage=data['dosage'],
            warnings=data['warnings'],
            alternatives=','.join(data.get('alternatives', [])),
            icon=data.get('icon', 'fa-solid fa-capsules')
        )
        db.add(med)
        db.commit()
        log_audit(db, 'CREATE_PRODUCT', 'Medicines', med.medicine_id, f'إضافة دواء جديد: {med.name_ar}')
        return jsonify({'success': True, 'message': 'تمت إضافة الدواء بنجاح', 'product': med.to_dict()}), 201
    except Exception as e:
        db.rollback()
        return jsonify({'error': 'Server Error', 'message': str(e)}), 500
    finally:
        db.close()

@app.route('/api/products/<medicine_id>', methods=['PUT'])
@login_required
@role_required(['admin', 'pharmacist']) # المدير أو الصيدلي يمكنهما تعديل السعر أو المخزون
def update_product(medicine_id):
    data = request.get_json() or {}
    db = SessionLocal()
    try:
        med = db.query(Medicine).get(medicine_id)
        if not med:
            return jsonify({'error': 'Not Found', 'message': 'الدواء غير موجود'}), 404

        # تحديث الحقول المسموحة
        if 'name' in data: med.name_ar = data['name']
        if 'price' in data: med.price = float(data['price'])
        if 'stockCount' in data: med.stock_count = int(data['stockCount'])
        if 'prescription' in data: med.requires_prescription = bool(data['prescription'])
        if 'indications' in data: med.indications = data['indications']
        if 'dosage' in data: med.dosage = data['dosage']
        if 'warnings' in data: med.warnings = data['warnings']

        db.commit()
        log_audit(db, 'UPDATE_PRODUCT', 'Medicines', med.medicine_id, f'تحديث بيانات: {med.name_ar}')
        return jsonify({'success': True, 'message': 'تم تحديث الدواء بنجاح', 'product': med.to_dict()})
    finally:
        db.close()

@app.route('/api/products/<medicine_id>', methods=['DELETE'])
@login_required
@role_required(['admin']) # حذف الدواء صلاحية حصرية للمدير العام فقط
def delete_product(medicine_id):
    db = SessionLocal()
    try:
        med = db.query(Medicine).get(medicine_id)
        if not med:
            return jsonify({'error': 'Not Found', 'message': 'الدواء غير موجود'}), 404

        med.is_active = False # Soft delete
        db.commit()
        log_audit(db, 'DELETE_PRODUCT', 'Medicines', medicine_id, f'تعطيل وحذف دواء: {med.name_ar}')
        return jsonify({'success': True, 'message': 'تم حذف الدواء بنجاح'})
    finally:
        db.close()

# ================= Categories API =================
@app.route('/api/categories', methods=['GET'])
def get_categories():
    db = SessionLocal()
    try:
        cats = db.query(Category).order_by(Category.sort_order).all()
        return jsonify([c.to_dict() for c in cats])
    finally:
        db.close()

# ================= Orders API =================
@app.route('/api/orders', methods=['POST'])
def place_order():
    """إنشاء طلب شراء جديد وخصم المخزون تلقائياً"""
    data = request.get_json() or {}
    cart_items = data.get('items', [])

    if not cart_items:
        return jsonify({'error': 'Bad Request', 'message': 'السلة فارغة'}), 400

    db = SessionLocal()
    try:
        order_num = 'SHF-' + ''.join(random.choices(string.digits, k=6))
        subtotal = 0.0
        order_items_objs = []

        # التحقق من المنتجات وحساب الأسعار وخصم المخزون
        for item in cart_items:
            med = db.query(Medicine).get(item['id'])
            if not med:
                continue

            qty = int(item['quantity'])
            price = float(med.price)
            subtotal += price * qty

            # خصم الكمية من المخزون
            if med.stock_count >= qty:
                med.stock_count -= qty
            else:
                med.stock_count = 0

            order_items_objs.append(
                OrderItem(
                    medicine_id=med.medicine_id,
                    medicine_name=med.name_ar,
                    quantity=qty,
                    unit_price=price
                )
            )

        shipping = 0.0 if subtotal >= 150 else 25.0
        discount = float(data.get('discount', 0.0))
        total = subtotal + shipping - discount

        order = Order(
            order_number=order_num,
            customer_name=data.get('name', 'عميل كريم'),
            customer_phone=data.get('phone', ''),
            customer_address=data.get('address', ''),
            payment_method=data.get('paymentMethod', 'الدفع عند الاستلام'),
            subtotal=subtotal,
            shipping_fee=shipping,
            discount_amount=discount,
            total_amount=total,
            notes=data.get('notes', ''),
            order_status='pending',
            items=order_items_objs
        )

        db.add(order)
        db.commit()

        log_audit(db, 'PLACE_ORDER', 'Orders', order.order_id, f'طلب شراء جديد رقم {order_num} بمبلغ {total} ج.م')

        return jsonify({
            'success': True,
            'message': 'تم استلام طلبك بنجاح',
            'order': order.to_dict()
        }), 201

    except Exception as e:
        db.rollback()
        return jsonify({'error': 'Server Error', 'message': str(e)}), 500
    finally:
        db.close()

@app.route('/api/orders', methods=['GET'])
@login_required
@role_required(['admin', 'pharmacist'])
def list_orders():
    status = request.args.get('status')
    db = SessionLocal()
    try:
        query = db.query(Order).order_by(Order.created_at.desc())
        if status and status != 'all':
            query = query.filter_by(order_status=status)
        orders = query.all()
        return jsonify([o.to_dict() for o in orders])
    finally:
        db.close()

@app.route('/api/orders/<int:order_id>/status', methods=['PUT'])
@login_required
@role_required(['admin', 'pharmacist'])
def update_order_status(order_id):
    data = request.get_json() or {}
    new_status = data.get('status')

    valid_statuses = ['pending', 'processing', 'out_for_delivery', 'delivered', 'cancelled']
    if new_status not in valid_statuses:
        return jsonify({'error': 'Bad Request', 'message': 'حالة الطلب غير صالحة'}), 400

    db = SessionLocal()
    try:
        order = db.query(Order).get(order_id)
        if not order:
            return jsonify({'error': 'Not Found', 'message': 'الطلب غير موجود'}), 404

        old_status = order.order_status
        order.order_status = new_status
        db.commit()

        log_audit(db, 'CHANGE_ORDER_STATUS', 'Orders', order_id, f'تغيير حالة الطلب {order.order_number} من {old_status} إلى {new_status}')

        return jsonify({'success': True, 'message': 'تم تحديث حالة الطلب بنجاح', 'order': order.to_dict()})
    finally:
        db.close()

# ================= Prescriptions API =================
@app.route('/api/prescriptions', methods=['POST'])
def upload_prescription():
    if 'image' not in request.files:
        return jsonify({'error': 'Bad Request', 'message': 'يرجى إرفاق صورة الروشتة'}), 400

    file = request.files['image']
    phone = request.form.get('phone', '')
    address = request.form.get('address', '')
    notes = request.form.get('notes', '')

    if file.filename == '':
        return jsonify({'error': 'Bad Request', 'message': 'لم يتم اختيار ملف'}), 400

    filename = secure_filename(f"rx_{int(datetime.utcnow().timestamp())}_{file.filename}")
    filepath = os.path.join(Config.UPLOAD_FOLDER, filename)
    file.save(filepath)

    rx_code = 'RX-' + ''.join(random.choices(string.digits, k=6))

    db = SessionLocal()
    try:
        rx = Prescription(
            prescription_code=rx_code,
            customer_phone=phone,
            customer_address=address,
            notes=notes,
            image_path=f"/static/uploads/prescriptions/{filename}",
            status='pending'
        )
        db.add(rx)
        db.commit()

        log_audit(db, 'UPLOAD_PRESCRIPTION', 'Prescriptions', rx.prescription_id, f'رفع روشتة طبية جديدة رقم {rx_code}')

        return jsonify({
            'success': True,
            'message': 'تم رفع الروشتة بنجاح، جاري مراجعتها من الصيدلي',
            'prescription': rx.to_dict()
        }), 201
    finally:
        db.close()

@app.route('/api/prescriptions', methods=['GET'])
@login_required
@role_required(['admin', 'pharmacist'])
def list_prescriptions():
    db = SessionLocal()
    try:
        rxs = db.query(Prescription).order_by(Prescription.created_at.desc()).all()
        return jsonify([r.to_dict() for r in rxs])
    finally:
        db.close()

@app.route('/api/prescriptions/<int:prescription_id>/status', methods=['PUT'])
@login_required
@role_required(['admin', 'pharmacist'])
def update_prescription_status(prescription_id):
    data = request.get_json() or {}
    new_status = data.get('status')
    notes = data.get('notes', '')

    db = SessionLocal()
    try:
        rx = db.query(Prescription).get(prescription_id)
        if not rx:
            return jsonify({'error': 'Not Found', 'message': 'الروشتة غير موجودة'}), 404

        rx.status = new_status
        rx.reviewed_by = session['user_id']
        rx.pharmacist_notes = notes
        db.commit()

        log_audit(db, 'REVIEW_PRESCRIPTION', 'Prescriptions', prescription_id, f'مراجعة وتحديث حالة الروشتة {rx.prescription_code} إلى {new_status}')

        return jsonify({'success': True, 'message': 'تم تحديث حالة الروشتة', 'prescription': rx.to_dict()})
    finally:
        db.close()

# ================= Admin Stats & KPI =================
@app.route('/api/admin/stats', methods=['GET'])
@login_required
@role_required(['admin', 'pharmacist'])
def get_admin_stats():
    db = SessionLocal()
    try:
        total_sales = db.query(Order).filter(Order.order_status != 'cancelled').all()
        sales_sum = sum(float(o.total_amount) for o in total_sales)

        total_orders = db.query(Order).count()
        pending_orders = db.query(Order).filter_by(order_status='pending').count()
        pending_prescriptions = db.query(Prescription).filter_by(status='pending').count()
        low_stock_medicines = db.query(Medicine).filter(Medicine.stock_count <= 20).count()
        total_products = db.query(Medicine).filter_by(is_active=True).count()

        return jsonify({
            'total_sales': round(sales_sum, 2),
            'total_orders': total_orders,
            'pending_orders': pending_orders,
            'pending_prescriptions': pending_prescriptions,
            'low_stock_medicines': low_stock_medicines,
            'total_products': total_products
        })
    finally:
        db.close()

@app.route('/api/admin/audit-logs', methods=['GET'])
@login_required
@role_required(['admin']) # المدير العام فقط من يطّلع على سجل التدقيق
def get_audit_logs():
    db = SessionLocal()
    try:
        logs = db.query(AuditLog).order_by(AuditLog.created_at.desc()).limit(50).all()
        return jsonify([l.to_dict() for l in logs])
    finally:
        db.close()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"\n=========================================================")
    print(f"  صيدلية الشفاء الذكية - خادم Python Flask يعمل الآن")
    print(f"  • الموقع للجمهور:   http://localhost:{port}/")
    print(f"  • لوحة التحكم:       http://localhost:{port}/admin")
    print(f"  • تسجيل الدخول:      http://localhost:{port}/login")
    print(f"  • حساب المدير:       admin      | AdminPassword@2026")
    print(f"  • حساب الصيدلي:      pharmacist | Pharmacist@2026")
    print(f"=========================================================\n")
    app.run(host='0.0.0.0', port=port, debug=True)
