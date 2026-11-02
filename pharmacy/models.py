from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Numeric, Boolean, DateTime, 
    ForeignKey, Text
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class Role(Base):
    __tablename__ = 'roles'

    role_id = Column(Integer, primary_key=True, autoincrement=True)
    role_name = Column(String(50), unique=True, nullable=False)   # 'admin', 'pharmacist'
    display_name = Column(String(100), nullable=False)            # 'المدير العام', 'الصيدلي المناوب'
    description = Column(String(255), nullable=True)

    users = relationship('User', back_populates='role')

    def to_dict(self):
        return {
            'role_id': self.role_id,
            'role_name': self.role_name,
            'display_name': self.display_name,
            'description': self.description
        }

class User(Base):
    __tablename__ = 'users'

    user_id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(50), unique=True, nullable=False)
    full_name = Column(String(150), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role_id = Column(Integer, ForeignKey('roles.role_id'), nullable=False)
    phone_number = Column(String(20), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    last_login = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    role = relationship('Role', back_populates='users')

    def to_dict(self):
        return {
            'user_id': self.user_id,
            'username': self.username,
            'full_name': self.full_name,
            'email': self.email,
            'role': self.role.role_name if self.role else None,
            'role_display': self.role.display_name if self.role else None,
            'phone_number': self.phone_number,
            'is_active': self.is_active,
            'last_login': self.last_login.strftime('%Y-%m-%d %H:%M:%S') if self.last_login else None
        }

class Category(Base):
    __tablename__ = 'categories'

    category_id = Column(String(50), primary_key=True)
    name_ar = Column(String(100), nullable=False)
    icon = Column(String(50), default='fa-solid fa-pills')
    sort_order = Column(Integer, default=0)

    medicines = relationship('Medicine', back_populates='category')

    def to_dict(self):
        return {
            'id': self.category_id,
            'name': self.name_ar,
            'icon': self.icon,
            'count': len(self.medicines) if self.medicines else 0
        }

class Medicine(Base):
    __tablename__ = 'medicines'

    medicine_id = Column(String(50), primary_key=True)
    name_ar = Column(String(200), nullable=False)
    name_en = Column(String(200), nullable=False)
    category_id = Column(String(50), ForeignKey('categories.category_id'), nullable=False)
    active_ingredient = Column(String(300), nullable=False)
    form = Column(String(100), nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    old_price = Column(Numeric(10, 2), nullable=True)
    requires_prescription = Column(Boolean, default=False, nullable=False)
    stock_count = Column(Integer, default=0, nullable=False)
    rating = Column(Numeric(2, 1), default=5.0)
    reviews_count = Column(Integer, default=0)
    badge = Column(String(50), nullable=True)
    badge_type = Column(String(30), default='normal')
    indications = Column(Text, nullable=False)
    dosage = Column(Text, nullable=False)
    warnings = Column(Text, nullable=False)
    alternatives = Column(Text, nullable=True) # Separated by comma
    icon = Column(String(50), default='fa-solid fa-capsules')
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    category = relationship('Category', back_populates='medicines')

    def to_dict(self):
        alts = [a.strip() for a in self.alternatives.split(',')] if self.alternatives else []
        return {
            'id': self.medicine_id,
            'name': self.name_ar,
            'nameEn': self.name_en,
            'category': self.category_id,
            'categoryName': self.category.name_ar if self.category else '',
            'activeIngredient': self.active_ingredient,
            'form': self.form,
            'price': float(self.price),
            'oldPrice': float(self.old_price) if self.old_price else None,
            'prescription': self.requires_prescription,
            'inStock': self.stock_count > 0,
            'stockCount': self.stock_count,
            'rating': float(self.rating),
            'reviewsCount': self.reviews_count,
            'badge': self.badge,
            'badgeType': self.badge_type,
            'indications': self.indications,
            'dosage': self.dosage,
            'warnings': self.warnings,
            'alternatives': alts,
            'icon': self.icon
        }

class Order(Base):
    __tablename__ = 'orders'

    order_id = Column(Integer, primary_key=True, autoincrement=True)
    order_number = Column(String(30), unique=True, nullable=False)
    customer_name = Column(String(150), nullable=False)
    customer_phone = Column(String(20), nullable=False)
    customer_address = Column(String(300), nullable=False)
    payment_method = Column(String(100), nullable=False)
    subtotal = Column(Numeric(10, 2), nullable=False)
    shipping_fee = Column(Numeric(10, 2), default=0.0)
    discount_amount = Column(Numeric(10, 2), default=0.0)
    total_amount = Column(Numeric(10, 2), nullable=False)
    order_status = Column(String(30), default='pending') # pending, processing, out_for_delivery, delivered, cancelled
    notes = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    items = relationship('OrderItem', back_populates='order', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'order_id': self.order_id,
            'order_number': self.order_number,
            'customer_name': self.customer_name,
            'customer_phone': self.customer_phone,
            'customer_address': self.customer_address,
            'payment_method': self.payment_method,
            'subtotal': float(self.subtotal),
            'shipping_fee': float(self.shipping_fee),
            'discount_amount': float(self.discount_amount),
            'total_amount': float(self.total_amount),
            'order_status': self.order_status,
            'notes': self.notes,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M'),
            'items': [item.to_dict() for item in self.items]
        }

class OrderItem(Base):
    __tablename__ = 'order_items'

    order_item_id = Column(Integer, primary_key=True, autoincrement=True)
    order_id = Column(Integer, ForeignKey('orders.order_id'), nullable=False)
    medicine_id = Column(String(50), ForeignKey('medicines.medicine_id'), nullable=False)
    medicine_name = Column(String(200), nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Numeric(10, 2), nullable=False)

    order = relationship('Order', back_populates='items')

    def to_dict(self):
        return {
            'medicine_id': self.medicine_id,
            'medicine_name': self.medicine_name,
            'quantity': self.quantity,
            'unit_price': float(self.unit_price),
            'total_price': float(self.unit_price * self.quantity)
        }

class Prescription(Base):
    __tablename__ = 'prescriptions'

    prescription_id = Column(Integer, primary_key=True, autoincrement=True)
    prescription_code = Column(String(30), unique=True, nullable=False)
    customer_phone = Column(String(20), nullable=False)
    customer_address = Column(String(300), nullable=False)
    notes = Column(String(500), nullable=True)
    image_path = Column(String(300), nullable=False)
    status = Column(String(30), default='pending') # pending, approved, rejected, completed
    reviewed_by = Column(Integer, ForeignKey('users.user_id'), nullable=True)
    pharmacist_notes = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    reviewer = relationship('User')

    def to_dict(self):
        return {
            'prescription_id': self.prescription_id,
            'prescription_code': self.prescription_code,
            'customer_phone': self.customer_phone,
            'customer_address': self.customer_address,
            'notes': self.notes,
            'image_path': self.image_path,
            'status': self.status,
            'reviewed_by': self.reviewer.full_name if self.reviewer else None,
            'pharmacist_notes': self.pharmacist_notes,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M')
        }

class AuditLog(Base):
    __tablename__ = 'audit_logs'

    log_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, nullable=True)
    username = Column(String(50), nullable=True)
    action = Column(String(100), nullable=False)
    entity_name = Column(String(50), nullable=False)
    entity_id = Column(String(50), nullable=True)
    details = Column(Text, nullable=True)
    ip_address = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'log_id': self.log_id,
            'username': self.username or 'زائر',
            'action': self.action,
            'entity_name': self.entity_name,
            'entity_id': self.entity_id,
            'details': self.details,
            'ip_address': self.ip_address,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S')
        }
