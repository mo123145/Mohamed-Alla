import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from werkzeug.security import generate_password_hash
from config import Config
from models import Base, Role, User, Category, Medicine

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# إنشاء محرك قاعدة البيانات مع آلية اتصال آمنة
try:
    engine = create_engine(
        Config.SQLALCHEMY_DATABASE_URI,
        pool_pre_ping=True,
        echo=False
    )
    # اختبار الاتصال
    with engine.connect() as conn:
        logger.info(f"Connected to database successfully: {Config.SQLALCHEMY_DATABASE_URI.split('@')[-1] if '@' in Config.SQLALCHEMY_DATABASE_URI else 'Local SQLite'}")
except Exception as e:
    logger.warning(f"Failed to connect to primary DB ({e}). Falling back to SQLite.")
    engine = create_engine(Config.SQLITE_URI, echo=False)

SessionLocal = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """إنشاء الجداول وحقن البيانات الافتراضية"""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # 1. إضافة الأدوار الافتراضية
        if not db.query(Role).filter_by(role_name='admin').first():
            admin_role = Role(role_name='admin', display_name='المدير العام', description='صلاحيات كاملة لإدارة النظام والمنتجات والطلبات')
            pharmacist_role = Role(role_name='pharmacist', display_name='الصيدلي المناوب', description='مراجعة الروشتات، متابعة المخزون، وتحديث حالات التوصيل')
            db.add_all([admin_role, pharmacist_role])
            db.commit()
            logger.info("Roles initialized.")

        # 2. إضافة المستخدمين الافتراضيين
        admin_role = db.query(Role).filter_by(role_name='admin').first()
        pharmacist_role = db.query(Role).filter_by(role_name='pharmacist').first()

        if not db.query(User).filter_by(username='admin').first():
            admin_user = User(
                username='admin',
                full_name='د. أحمد سالم (مدير الصيدلية)',
                email='admin@shefaa.com',
                password_hash=generate_password_hash('AdminPassword@2026'),
                role_id=admin_role.role_id,
                phone_number='01000000001'
            )
            pharmacist_user = User(
                username='pharmacist',
                full_name='د. سارة محمود (صيدلي مناوب)',
                email='pharmacist@shefaa.com',
                password_hash=generate_password_hash('Pharmacist@2026'),
                role_id=pharmacist_role.role_id,
                phone_number='01000000002'
            )
            db.add_all([admin_user, pharmacist_user])
            db.commit()
            logger.info("Default Admin and Pharmacist users seeded.")

        # 3. إضافة الأقسام الطبية
        categories_data = [
            ('pain_fever', 'مسكنات وخافضات حرارة', 'fa-solid fa-head-side-virus', 1),
            ('antibiotics', 'مضادات حيوية ومطهرات', 'fa-solid fa-shield-virus', 2),
            ('digestive', 'الجهاز الهضمي والمعدة', 'fa-solid fa-stethoscope', 3),
            ('respiratory', 'الحساسية والجهاز التنفسي', 'fa-solid fa-lungs', 4),
            ('chronic', 'الضغط والقلب والسكر', 'fa-solid fa-heart-pulse', 5),
            ('vitamins', 'فيتامينات ومكملات غذائية', 'fa-solid fa-apple-whole', 6),
            ('skin_hair', 'العناية بالبشرة والشعر', 'fa-solid fa-spa', 7),
            ('pediatrics', 'صحة ورعاية الأطفال', 'fa-solid fa-baby', 8),
            ('medical_supplies', 'مستلزمات وأجهزة طبية', 'fa-solid fa-kit-medical', 9)
        ]

        for cid, name, icon, order in categories_data:
            if not db.query(Category).filter_by(category_id=cid).first():
                db.add(Category(category_id=cid, name_ar=name, icon=icon, sort_order=order))
        db.commit()

        # 4. إضافة الأدوية الافتراضية
        if db.query(Medicine).count() == 0:
            seed_initial_medicines(db)
            logger.info("All 39 Medicines seeded successfully.")

    except Exception as e:
        db.rollback()
        logger.error(f"Error during DB initialization: {e}")
    finally:
        db.close()

def seed_initial_medicines(db):
    """حقن الأدوية الـ 39 الشاملة في قاعدة البيانات"""
    medicines = [
        # مسكنات
        Medicine(medicine_id='med-01', name_ar='بنادول أدفانس', name_en='Panadol Advance 500mg', category_id='pain_fever',
                 active_ingredient='باراسيتامول 500 ملغ', form='أقراص (24 قرص)', price=32.0, old_price=38.0,
                 requires_prescription=False, stock_count=150, rating=4.9, reviews_count=320, badge='الأكثر طلباً', badge_type='hot',
                 indications='تسكين آلام الصداع، الأسنان، نزلات البرد وخفض الحرارة.', dosage='قرص إلى قرصين كل 4-6 ساعات.', warnings='لا تتناول أدوية أخرى تحتوي على باراسيتامول في نفس الوقت.',
                 alternatives='أدول 500 ملغ, فيفادول 500 ملغ, نوفالدول 1000 ملغ', icon='fa-solid fa-capsules'),
        Medicine(medicine_id='med-02', name_ar='بنادول إكسترا الأحمر', name_en='Panadol Extra', category_id='pain_fever',
                 active_ingredient='باراسيتامول 500 ملغ + كافيين 65 ملغ', form='أقراص (24 قرص)', price=45.0, old_price=50.0,
                 requires_prescription=False, stock_count=88, rating=4.8, reviews_count=215, badge='فعالية مضاعفة', badge_type='featured',
                 indications='مسكن قوي للصداع النصفي، آلام الطمث والظهر.', dosage='قرصين كل 4-6 ساعات.', warnings='يحتوي على كافيين؛ لا يناسب الحوامل.',
                 alternatives='سيتال إكسترا, فيفادول بلس, أدول إكسترا', icon='fa-solid fa-tablets'),
        Medicine(medicine_id='med-03', name_ar='بروفين 400', name_en='Brufen 400mg', category_id='pain_fever',
                 active_ingredient='إيبوبروفين 400 ملغ', form='أقراص (30 قرص)', price=48.0, old_price=None,
                 requires_prescription=False, stock_count=64, rating=4.7, reviews_count=180, badge='مضاد التهاب', badge_type='normal',
                 indications='مسكن ومضاد للالتهاب لآلام المفاصل والأسنان والعضلات.', dosage='قرص 3 مرات يومياً بعد الأكل.', warnings='يحذر لمرضى قرحة المعدة والقصور الكلوي.',
                 alternatives='بروف 400, ماركوفين 400, دولوراز 400', icon='fa-solid fa-pills'),
        Medicine(medicine_id='med-04', name_ar='كتافلام 50', name_en='Cataflam 50mg', category_id='pain_fever',
                 active_ingredient='ديكلوفيناك بوتاسيوم 50 ملغ', form='أقراص (20 قرص)', price=55.0, old_price=62.0,
                 requires_prescription=True, stock_count=95, rating=4.9, reviews_count=290, badge='سريع المفعول', badge_type='rx',
                 indications='مسكن فوري قوي لآلام الأسنان الحادة والنقرس والالتواءات.', dosage='قرص 2-3 مرات يومياً بعد الأكل.', warnings='ممنوع لمرضى القلب وقرحة المعدة النشطة.',
                 alternatives='فولتارين ك 50, ديكلاك 50, أوفلام 50', icon='fa-solid fa-tablets'),
        Medicine(medicine_id='med-05', name_ar='فولتارين 100 ريتارد', name_en='Voltaren Retard 100mg', category_id='pain_fever',
                 active_ingredient='ديكلوفيناك صوديوم 100 ملغ ممتد المفعول', form='أقراص (20 قرص)', price=68.0, old_price=None,
                 requires_prescription=True, stock_count=42, rating=4.6, reviews_count=142, badge='ممتد 24 ساعة', badge_type='rx',
                 indications='علاج خشونة المفاصل والتهاب الفقرات وآلام الظهر المزمنة.', dosage='قرص واحد يومياً بعد العشاء.', warnings='يلزم استشارة الطبيب وتجنب أخذه مع مسكنات أخرى.',
                 alternatives='ديكلاك 150 ريتارد, أولفين 100 ديبو', icon='fa-solid fa-capsules'),
        Medicine(medicine_id='med-06', name_ar='كيتوفان 50', name_en='Ketofan 50mg', category_id='pain_fever',
                 active_ingredient='كيتوبروفين 50 ملغ', form='كبسولات (20 كبسولة)', price=28.0, old_price=None,
                 requires_prescription=False, stock_count=75, rating=4.5, reviews_count=98, badge='مسكن عظام ومفاصل', badge_type='normal',
                 indications='مسكن قوي لآلام العظام والمفاصل والرقبة.', dosage='كبسولة 3 مرات يومياً بعد الوجبات.', warnings='يؤخذ بعد الأكل لتجنب انزعاج المعدة.',
                 alternatives='باي-ألكوفان 150, توبفيل 50', icon='fa-solid fa-capsules'),

        # مضادات حيوية
        Medicine(medicine_id='med-07', name_ar='أوجمنتين 1 جم', name_en='Augmentin 1g', category_id='antibiotics',
                 active_ingredient='أموكسيسيلين 875 ملغ + حمض كلافولانيك 125 ملغ', form='أقراص (14 قرص)', price=115.0, old_price=130.0,
                 requires_prescription=True, stock_count=110, rating=4.9, reviews_count=410, badge='واسع المجال', badge_type='rx',
                 indications='علاج التهابات الجهاز التنفسي واللوزتين والمسالك البولية وخراجات الأسنان.', dosage='قرص كل 12 ساعة مع الطعام لمدة 7 أيام.', warnings='ممنوع لمن يعانون من حساسية البنسلين.',
                 alternatives='كيورام 1 جم, كلافوكس 1 جم, ميجاموكس 1 جم', icon='fa-solid fa-tablets'),
        Medicine(medicine_id='med-08', name_ar='زيثروماكس 500', name_en='Zithromax 500mg', category_id='antibiotics',
                 active_ingredient='أزيثروميسين 500 ملغ', form='كبسولات (3 كبسولات)', price=98.0, old_price=110.0,
                 requires_prescription=True, stock_count=52, rating=4.8, reviews_count=230, badge='كورس 3 أيام', badge_type='rx',
                 indications='علاج عدوى الصدر والتهاب الحلق والجيوب الأنفية والجلد.', dosage='كبسولة واحدة يومياً قبل الأكل بساعة لمدة 3 أيام.', warnings='يؤخذ في نفس التوقيت يومياً.',
                 alternatives='زيسروسين 500, أزيثرومايسين 500', icon='fa-solid fa-capsules'),
        Medicine(medicine_id='med-09', name_ar='سيبروفار 500', name_en='Ciprofar 500mg', category_id='antibiotics',
                 active_ingredient='سيبروفلوكساسين 500 ملغ', form='أقراص (10 أقراص)', price=52.0, old_price=None,
                 requires_prescription=True, stock_count=40, rating=4.7, reviews_count=88, badge='مسالك ونزلات معوية', badge_type='rx',
                 indications='التهابات المسالك البولية الحادة والنزلات المعوية البكتيرية.', dosage='قرص كل 12 ساعة مع وفرة من الماء.', warnings='ممنوع للأطفال تحت سن 18 عاماً وللحوامل.',
                 alternatives='سيبروكسين 500, سيفلوكس 500', icon='fa-solid fa-tablets'),
        Medicine(medicine_id='med-10', name_ar='فلاجيل 500', name_en='Flagyl 500mg', category_id='antibiotics',
                 active_ingredient='ميترونيدازول 500 ملغ', form='أقراص (20 قرص)', price=36.0, old_price=None,
                 requires_prescription=False, stock_count=130, rating=4.6, reviews_count=165, badge='مطهر معوي وطفيل', badge_type='normal',
                 indications='مطهر معوي واسع المجال للأميبا والجيارديا وخراجات اللثة والأسنان.', dosage='قرص كل 8 ساعات بعد الأكل لمدة أسبوع.', warnings='يمنع تناول الكحوليات أثناء تناوله نهائياً.',
                 alternatives='أموديازول 500, فلاجيلات فور 500', icon='fa-solid fa-tablets'),
        Medicine(medicine_id='med-11', name_ar='بيتادين مطهر جراحي 120 مل', name_en='Betadine Antiseptic Solution 10%', category_id='antibiotics',
                 active_ingredient='بوفيدون يود 10%', form='محلول موضعي 120 مل', price=42.0, old_price=48.0,
                 requires_prescription=False, stock_count=85, rating=4.9, reviews_count=190, badge='مطهر جروح معتمد', badge_type='featured',
                 indications='تطهير وتعقيم الجروح والخدوش السطحية والحروق قبل الضماد.', dosage='يوضع مباشرة على الجلد المصاب مرتين يومياً.', warnings='للاستعمال الخارجي فقط.',
                 alternatives='بوفيدين 10%, سيبتادين مطهر', icon='fa-solid fa-pump-medical'),

        # معدة وجهاز هضمي
        Medicine(medicine_id='med-12', name_ar='كونترولوك 40 ملغ', name_en='Controloc 40mg', category_id='digestive',
                 active_ingredient='بانتوبرازول 40 ملغ', form='أقراص (28 قرص)', price=135.0, old_price=150.0,
                 requires_prescription=True, stock_count=90, rating=4.9, reviews_count=380, badge='الأعلى تقييماً للمعدة', badge_type='hot',
                 indications='علاج ارتجاع المريء الشديد وحموضة المعدة وقرحة المعدة والاثني عشر.', dosage='قرص يومياً على الريق قبل الإفطار بنصف ساعة.', warnings='يبلع كاملاً دون كسر أو مضغ.',
                 alternatives='زوركال 40, بروتوفكس 40, بانتوزول 40', icon='fa-solid fa-tablets'),
        Medicine(medicine_id='med-13', name_ar='نيكسيوم 40 ملغ', name_en='Nexium 40mg', category_id='digestive',
                 active_ingredient='إيزوميبرازول 40 ملغ', form='أقراص (28 قرص)', price=175.0, old_price=195.0,
                 requires_prescription=True, stock_count=65, rating=4.9, reviews_count=512, badge='درجة أولى للحموضة', badge_type='featured',
                 indications='العلاج الذهبي لحرقة وتآكل المريء الحمضي والارتجاع المعدي المريئي.', dosage='قرص صباحاً قبل الأكل بنصف ساعة.', warnings='يحفظ بعيداً عن الرطوبة.',
                 alternatives='إيزومبيرازول 40, نيكست كيور 40', icon='fa-solid fa-tablets'),
        Medicine(medicine_id='med-14', name_ar='جافيسكون شراب بالنعناع', name_en='Gaviscon Double Action 300ml', category_id='digestive',
                 active_ingredient='ألجينات الصوديوم + بيكربونات الصوديوم', form='شراب سائل مهدئ 300 مل', price=65.0, old_price=75.0,
                 requires_prescription=False, stock_count=140, rating=4.8, reviews_count=310, badge='راحة فورية من الحرقان', badge_type='hot',
                 indications='راحة فورية خلال 3 دقائق من حرقة المعدة وعسر الهضم وارتجاع الأحماض.', dosage='10 إلى 20 مل بعد الوجبات وقبل النوم.', warnings='آمن للحوامل.',
                 alternatives='مالوكس بلس, إبيكوجيل, ريني للمضغ', icon='fa-solid fa-bottle-droplet'),
        Medicine(medicine_id='med-15', name_ar='دوسباتالين ريتارد 200', name_en='Duspatalin Retard 200mg', category_id='digestive',
                 active_ingredient='ميبيفيرين هيدروكلوريد 200 ملغ', form='كبسولات (30 كبسولة)', price=88.0, old_price=None,
                 requires_prescription=False, stock_count=82, rating=4.7, reviews_count=195, badge='مهدئ القولون العصبي', badge_type='normal',
                 indications='تخفيف تقلصات وانتفاخات وآلام القولون العصبي وتشنجات الأمعاء.', dosage='كبسولة مرتين يومياً قبل الطعام بـ 20 دقيقة.', warnings='لا تكسر الكبسولة.',
                 alternatives='كولونا أقراص, كولوفيرين د, سباسمومين', icon='fa-solid fa-capsules'),
        Medicine(medicine_id='med-16', name_ar='أنتينال كبسول', name_en='Antinal 200mg', category_id='digestive',
                 active_ingredient='نيفوروكسازيد 200 ملغ', form='كبسولات (24 كبسولة)', price=32.0, old_price=None,
                 requires_prescription=False, stock_count=160, rating=4.8, reviews_count=420, badge='مطهر وموقف للإسهال', badge_type='hot',
                 indications='علاج النزلات المعوية والإسهال الحاد والتهاب الأمعاء البكتيري.', dosage='كبسولة 4 مرات يومياً كل 6 ساعات.', warnings='اشرب كميات كافية من السوائل لمنع الجفاف.',
                 alternatives='دياكس كبسول, إرسيفوريل 200', icon='fa-solid fa-capsules'),

        # حساسية وتنفس
        Medicine(medicine_id='med-17', name_ar='تلفاست 180 ملغ', name_en='Telfast 180mg Non-Drowsy', category_id='respiratory',
                 active_ingredient='فيكسوفينادين 180 ملغ', form='أقراص غير مسببة للنعاس (20 قرص)', price=84.0, old_price=95.0,
                 requires_prescription=False, stock_count=78, rating=4.9, reviews_count=260, badge='لا يسبب النعاس', badge_type='featured',
                 indications='علاج حساسية الأنف والجيوب الأنفية والعطس والارتيكاريا الجلدية.', dosage='قرص واحد يومياً مع الماء.', warnings='تجنب عصير الجريب فروت مع الدواء.',
                 alternatives='فيكسو 180, أليجرا 180', icon='fa-solid fa-tablets'),
        Medicine(medicine_id='med-18', name_ar='زيرتك 10 ملغ', name_en='Zyrtec 10mg', category_id='respiratory',
                 active_ingredient='سيتريزين 10 ملغ', form='أقراص (20 قرص)', price=45.0, old_price=52.0,
                 requires_prescription=False, stock_count=115, rating=4.8, reviews_count=340, badge='مضاد حساسية شامل', badge_type='normal',
                 indications='الرشح وحمى القش وحساسية العينين ولدغات الحشرات.', dosage='قرص واحد مساءً قبل النوم.', warnings='قد يسبب نعاساً خفيفاً لبعض الأشخاص.',
                 alternatives='ستراك 10, أرتيز 10, هيستازين', icon='fa-solid fa-tablets'),
        Medicine(medicine_id='med-19', name_ar='بخاخ فنتولين للأزمات', name_en='Ventolin Evohaler 100mcg', category_id='respiratory',
                 active_ingredient='سالبوتامول 100 ميكروغرام', form='بخاخ استنشاق (200 جرعة)', price=62.0, old_price=70.0,
                 requires_prescription=True, stock_count=58, rating=4.9, reviews_count=470, badge='موسع شعب سريع', badge_type='rx',
                 indications='الإغاثة الفورية والسريعة من نوبات الربو وضيق التنفس وتشنج الشعب.', dosage='بخة إلى بختين عند الشعور بضيق التنفس.', warnings='رج العبوة جيداً قبل الاستعمال.',
                 alternatives='بيوترول بخاخ, أستالين بخاخ', icon='fa-solid fa-spray-can'),
        Medicine(medicine_id='med-20', name_ar='أوتريفين بخاخ للأنف للكبار', name_en='Otrivin Adult Nasal Spray', category_id='respiratory',
                 active_ingredient='زايلوميتازولين 0.1%', form='بخاخ مزيل للاحتقان 10 مل', price=24.0, old_price=None,
                 requires_prescription=False, stock_count=190, rating=4.7, reviews_count=380, badge='فتح الأنف في دقيقتين', badge_type='hot',
                 indications='إزالة فورية لاحتقان وانسداد الأنف والزكام الشديد.', dosage='بخة في كل فتحة أنف مرتين يومياً.', warnings='لا يستخدم لأكثر من 5 أيام متتالية لمنع التعود.',
                 alternatives='ديكوزال بخاخ, نوزالين بخاخ', icon='fa-solid fa-spray-can'),

        # ضغط وقلب وسكر
        Medicine(medicine_id='med-21', name_ar='كونكور 5 ملغ', name_en='Concor 5mg', category_id='chronic',
                 active_ingredient='بيسوبرولول فومارات 5 ملغ', form='أقراص (30 قرص)', price=72.0, old_price=None,
                 requires_prescription=True, stock_count=120, rating=4.9, reviews_count=520, badge='منظم ضربات وضغط', badge_type='rx',
                 indications='علاج ارتفاع ضغط الدم وتنظيم ضربات القلب وقصور العضلة القلبية.', dosage='قرص واحد صباحاً يومياً في نفس الميعاد.', warnings='ممنوع إيقاف الدواء فجأة دون استشارة الطبيب.',
                 alternatives='بيستول 5, بيسوكارد 5, لودوز 5', icon='fa-solid fa-heart-pulse'),
        Medicine(medicine_id='med-22', name_ar='جلوكوفاج 1000 ملغ XR', name_en='Glucophage XR 1000mg', category_id='chronic',
                 active_ingredient='ميتفورمين ممتد المفعول 1000 ملغ', form='أقراص (30 قرص)', price=65.0, old_price=72.0,
                 requires_prescription=True, stock_count=140, rating=4.8, reviews_count=460, badge='تنظيم السكر والتكيسات', badge_type='rx',
                 indications='السيطرة على سكري النوع الثاني وتحسين حساسية الإنسولين وتكيس المبايض.', dosage='قرص مع وجبة العشاء مع كوب ماء كبير.', warnings='يفضل قياس وظائف الكلى دورياً.',
                 alternatives='سيدوفاج 1000, ميتفورال 1000', icon='fa-solid fa-tablets'),
        Medicine(medicine_id='med-23', name_ar='إكسفورج 10/160 ملغ', name_en='Exforge 10/160mg', category_id='chronic',
                 active_ingredient='أملوديبين 10 ملغ + فالسارتان 160 ملغ', form='أقراص (28 قرص)', price=215.0, old_price=240.0,
                 requires_prescription=True, stock_count=35, rating=4.9, reviews_count=185, badge='ضغط دم متقدم', badge_type='rx',
                 indications='السيطرة الفعالة على ضغط الدم المرتفع غير المستجيب للعلاج الفردي.', dosage='قرص واحد يومياً صباحاً.', warnings='ممنوع تماماً أثناء فترات الحمل.',
                 alternatives='أمفال 10/160, فالساملو 10/160', icon='fa-solid fa-capsules'),
        Medicine(medicine_id='med-24', name_ar='ليبيتور 20 ملغ للكوليسترول', name_en='Lipitor 20mg', category_id='chronic',
                 active_ingredient='أتورفاستاتين 20 ملغ', form='أقراص (28 قرص)', price=145.0, old_price=160.0,
                 requires_prescription=True, stock_count=70, rating=4.8, reviews_count=310, badge='حماية القلب والشرايين', badge_type='rx',
                 indications='خفض الكوليسترول الضار والدهون الثلاثية والوقاية من الجلطات.', dosage='قرص واحد يومياً ليلاً قبل النوم.', warnings='أبلغ الطبيب فوراً حال حدوث آلام عضلية شديدة.',
                 alternatives='أتور 20, أتوكول 20, تورفاكول', icon='fa-solid fa-tablets'),

        # فيتامينات ومكملات
        Medicine(medicine_id='med-25', name_ar='فيتامين د3 50,000 وحدة دولية', name_en='Vitamin D3 50,000 IU', category_id='vitamins',
                 active_ingredient='كوليكالسيفيرول 50,000 وحدة دولية', form='كبسولات جيلاتينية رخوة (12 كبسولة)', price=120.0, old_price=140.0,
                 requires_prescription=False, stock_count=95, rating=4.9, reviews_count=650, badge='جرعة أسبوعية مركزة', badge_type='hot',
                 indications='علاج نقص فيتامين د الحاد وتقوية العظام والمناعة ومقاومة الخمول.', dosage='كبسولة واحدة أسبوعياً مع وجبة دسمة.', warnings='ينصح بفحص مستوى فيتامين د بالدم دورياً.',
                 alternatives='ديفارول إس أمبول, أوسوفورتين 50000', icon='fa-solid fa-sun'),
        Medicine(medicine_id='med-26', name_ar='أوميجا 3 بلس بزيت السمك', name_en='Omega 3 Plus', category_id='vitamins',
                 active_ingredient='زيت سمك 1000 ملغ + زيت جنين القمح 100 ملغ', form='كبسولات رخوة (30 كبسولة)', price=85.0, old_price=95.0,
                 requires_prescription=False, stock_count=110, rating=4.8, reviews_count=380, badge='للذاكرة والتركيز والقلب', badge_type='featured',
                 indications='تعزيز وظائف الدماغ والذاكرة وصحة المفاصل وخفض الدهون الثلاثية.', dosage='كبسولة إلى كبسولتين يومياً بعد الأكل.', warnings='يحفظ في مكان بارد.',
                 alternatives='سوبر أوميجا 3, زيت كبد الحوت', icon='fa-solid fa-brain'),
        Medicine(medicine_id='med-27', name_ar='فيروجلوبين ب12 للحديد والأنيميا', name_en='Feroglobin B12', category_id='vitamins',
                 active_ingredient='حديد بطيء التحرر + حمض الفوليك + فيتامين ب12 وب6 + زنك', form='كبسولات لطيفة على المعدة (30 كبسولة)', price=95.0, old_price=110.0,
                 requires_prescription=False, stock_count=85, rating=4.9, reviews_count=430, badge='لطيف بدون إمساك', badge_type='hot',
                 indications='علاج فقر الدم والأنيميا وتساقط الشعر والتعب والإجهاد العام.', dosage='كبسولة يومياً بعد وجبة رئيسية.', warnings='تجنب الشاي والقهوة والحليب خلال ساعتين من تناوله.',
                 alternatives='فيروترون كبسول, هيموتون, فروز حديد', icon='fa-solid fa-droplet'),
        Medicine(medicine_id='med-28', name_ar='نيوروبيون لتقوية الأعصاب', name_en='Neurobion B-Complex', category_id='vitamins',
                 active_ingredient='فيتامين ب1 وب6 وب12 بتركيزات علاجية', form='أقراص (30 قرص)', price=55.0, old_price=None,
                 requires_prescription=False, stock_count=130, rating=4.8, reviews_count=390, badge='صحة الأعصاب والتنميل', badge_type='normal',
                 indications='علاج التهاب وتلف الأعصاب الطرفية لمرضى السكري وعلاج تنميل الأطراف.', dosage='قرص من مرة إلى مرتين يومياً بعد الأكل.', warnings='قد يغير لون البول إلى الأصفر الزاهي وهو طبيعي.',
                 alternatives='ميلجا أدفانس, تراي-بي, نيوروفيت', icon='fa-solid fa-bolt'),

        # عناية بالبشرة والشعر
        Medicine(medicine_id='med-29', name_ar='بيبانثين كريم مرطب ومعالج', name_en='Bepanthen Moisturizing Cream 30g', category_id='skin_hair',
                 active_ingredient='ديكسبانثينول (برو فيتامين ب5) 5%', form='كريم مرطب 30 جم', price=85.0, old_price=95.0,
                 requires_prescription=False, stock_count=180, rating=5.0, reviews_count=780, badge='الأكثر مبيعاً للبشرة', badge_type='hot',
                 indications='ترطيب عميق للبشرة الجافة وعلاج تشققات الجلد واليدين وحروق الشمس السطحية.', dosage='يدهن طبقة رقيقة 2-3 مرات يومياً.', warnings='للاستعمال الخارجي فقط.',
                 alternatives='بانثينول كريم 5%, ديكسابانثينول جيل', icon='fa-solid fa-spa'),
        Medicine(medicine_id='med-30', name_ar='فيوسيدين كريم مضاد حيوي', name_en='Fucidin Cream 2%', category_id='skin_hair',
                 active_ingredient='حمض الفوسيديك 2%', form='أنبوبة كريم 20 جم', price=45.0, old_price=None,
                 requires_prescription=False, stock_count=125, rating=4.9, reviews_count=310, badge='حب الشباب والدمامل', badge_type='featured',
                 indications='علاج الدمامل وحب الشباب المتقيح والتهاب بصيلات الشعر وجروح ما بعد الليزر.', dosage='يدهن برفق 2-3 مرات يومياً على المنطقة المصابة.', warnings='لا يستخدم لفترات طويلة لتجنب مناعة البكتيريا.',
                 alternatives='فيوسيديرم, ديرموفوسين, باكتوبان', icon='fa-solid fa-hand-holding-medical'),
        Medicine(medicine_id='med-31', name_ar='نيزورال شامبو لعلاج القشرة', name_en='Nizoral Anti-Dandruff Shampoo', category_id='skin_hair',
                 active_ingredient='كيتوكونازول 2% مضاد للفطريات', form='شامبو طبي علاجي 100 مل', price=95.0, old_price=110.0,
                 requires_prescription=False, stock_count=65, rating=4.8, reviews_count=290, badge='القضاء على القشرة', badge_type='hot',
                 indications='القضاء النهائي على قشرة الرأس المستعصية والتهاب الجلد الدهني والتينيا.', dosage='يترك على الفروة 3-5 دقائق قبل الشطف مرتين أسبوعياً.', warnings='تجنب ملامسة العينين.',
                 alternatives='داندوفري شامبو, سيلسون بلو', icon='fa-solid fa-pump-soap'),
        Medicine(medicine_id='med-32', name_ar='سيروم فيتامين سي النقي 10%', name_en='Pure Vitamin C Radiance Serum', category_id='skin_hair',
                 active_ingredient='حمض الأسكوربيك النقي 10% + هيالورونيك + فيتامين E', form='سيروم نضارة قطارة 30 مل', price=185.0, old_price=220.0,
                 requires_prescription=False, stock_count=45, rating=4.9, reviews_count=340, badge='نضارة ومكافحة التجاعيد', badge_type='featured',
                 indications='تفتيح وتوحيد لون البشرة وإزالة التصبغات وتحفيز الكولاجين الطبيعي.', dosage='4 قطرات صباحاً ومساءً على بشرة نظيفة.', warnings='يحفظ في مكان بارد ومظلم لمنع الأكسدة.',
                 alternatives='لاروش بوزيه سي 10, فيشي ليفت أكتيف', icon='fa-solid fa-eye-dropper'),

        # صحة ورعاية الأطفال
        Medicine(medicine_id='med-33', name_ar='سيتال شراب للأطفال وخافض حرارة', name_en='Cetal Paediatric Syrup 120ml', category_id='pediatrics',
                 active_ingredient='باراسيتامول 250 ملغ / 5 مل', form='شراب أطفال 120 مل', price=22.0, old_price=None,
                 requires_prescription=False, stock_count=210, rating=5.0, reviews_count=680, badge='أمان تام للأطفال', badge_type='hot',
                 indications='خفض حرارة الأطفال الفوري وتسكين آلام التسنين وما بعد التطعيمات.', dosage='15 ملغ لكل كجم من وزن الطفل كل 4-6 ساعات.', warnings='لا تتجاوز 4 جرعات خلال 24 ساعة.',
                 alternatives='بنادول أطفال شراب, فيفادول أطفال', icon='fa-solid fa-baby'),
        Medicine(medicine_id='med-34', name_ar='دينتينوكس قطرات للمغص والغازات', name_en='Dentinox Colic Drops 100ml', category_id='pediatrics',
                 active_ingredient='أكتيفاتيد دايميثيكون 21 ملغ / 2.5 مل', form='معلق فموي مع قطارة 100 مل', price=48.0, old_price=55.0,
                 requires_prescription=False, stock_count=95, rating=4.8, reviews_count=360, badge='راحة الرضيع من المغص', badge_type='featured',
                 indications='تخفيف نوبات المغص الشديد والغازات الناتجة عن ابتلاع الهواء للرضع.', dosage='2.5 مل مع أو بعد كل رضعة حتى 6 مرات يومياً.', warnings='ترج الزجاجة جيداً قبل الاستعمال.',
                 alternatives='بيبي درينك أعشاب, سمبلكس نقط, ماء غريب', icon='fa-solid fa-bottle-droplet'),
        Medicine(medicine_id='med-35', name_ar='سودوكريم كريم التهابات الحفاض', name_en='Sudocrem Healing Cream 125g', category_id='pediatrics',
                 active_ingredient='أكسيد الزنك + لانولين + بنزيل بنزوات', form='عبوة كريم 125 جم', price=140.0, old_price=165.0,
                 requires_prescription=False, stock_count=75, rating=5.0, reviews_count=920, badge='حماية فائقة من التسلخات', badge_type='hot',
                 indications='علاج ووقاية سريعة من التهابات وتسلخات الحفاضات عند الرضع وتشكيل حاجز مائي عازل.', dosage='يوضع طبقة رقيقة عند كل تغيير حفاض.', warnings='يكفي مقدار ضئيل جداً لتغطية المنطقة.',
                 alternatives='زنك أوليف كريم, سانوسان كريم حفاض', icon='fa-solid fa-shield-heart'),

        # أجهزة ومستلزمات
        Medicine(medicine_id='med-36', name_ar='جهاز قياس ضغط الدم أومرون M2', name_en='Omron M2 Basic Blood Pressure', category_id='medical_supplies',
                 active_ingredient='تقنية قياس الذراع الرقمية التلقائية', form='جهاز إلكتروني رقمي + حزام ذراع', price=850.0, old_price=990.0,
                 requires_prescription=False, stock_count=22, rating=4.9, reviews_count=175, badge='ضمان 3 سنوات معتمد', badge_type='hot',
                 indications='قياس دقيق لضغط الدم والنبض في المنزل مع كشف عدم انتظام ضربات القلب.', dosage='يقاس الضغط في وضعية الجلوس الهادئ بمحاذاة القلب.', warnings='تجنب التدخين والكافيين قبل القياس بـ 30 دقيقة.',
                 alternatives='أومرون M3 المتقدم, بيورير الألماني BM28', icon='fa-solid fa-heart-pulse'),
        Medicine(medicine_id='med-37', name_ar='جهاز قياس السكر الفوري أكيو-تشيك', name_en='Accu-Chek Instant Glucometer', category_id='medical_supplies',
                 active_ingredient='مستشعر دقيق لقراءة عينة الدم في 4 ثوانٍ', form='جهاز قياس + قلم وخز + 10 شرائط', price=380.0, old_price=420.0,
                 requires_prescription=False, stock_count=38, rating=4.9, reviews_count=340, badge='قراءة في 4 ثوانٍ', badge_type='featured',
                 indications='المتابعة اليومية الدقيقة لمستوى السكر في الدم لمرضى السكري.', dosage='عينة دم مجهرية 0.6 ميكرولتر تظهر النتيجة فوراً.', warnings='تحفظ الشرائط في علبتها المغلقة.',
                 alternatives='وان تاتش سلكت بلس, كونتور تي إس', icon='fa-solid fa-droplet'),
        Medicine(medicine_id='med-38', name_ar='ترمومتر رقمي فوري لقياس الحرارة', name_en='Digital Clinical Thermometer', category_id='medical_supplies',
                 active_ingredient='مستشعر حراري بطرف مرن مضاد للماء', form='ترمومتر ديجيتال مع إنذار صوتي', price=65.0, old_price=80.0,
                 requires_prescription=False, stock_count=150, rating=4.8, reviews_count=290, badge='قراءة خلال 30 ثانية', badge_type='normal',
                 indications='قياس سريع ودقيق لدرجة حرارة الجسم للأطفال والبالغين.', dosage='يوضع تحت اللسان أو الإبط حتى صافرة الإنذار.', warnings='يعقم بالكحول قبل وبعد كل استخدام.',
                 alternatives='ترمومتر الأشعة بدون لمس, ترمومتر أذن رقمي', icon='fa-solid fa-temperature-three-quarters'),
        Medicine(medicine_id='med-39', name_ar='حقيبة إسعافات أولية منزلية 45 قطعة', name_en='Complete Emergency First Aid Kit', category_id='medical_supplies',
                 active_ingredient='شاش معقم + قطن + بلاستر + مطهر + مقص + ملقط', form='شنطة قماشية حمراء ضد الماء 45 قطعة', price=195.0, old_price=240.0,
                 requires_prescription=False, stock_count=45, rating=4.9, reviews_count=160, badge='أساسية لكل منزل وسيارة', badge_type='hot',
                 indications='التعامل الفوري مع حوادث الجروح والنزيف والحروق الخفيفة والكدمات.', dosage='مرفق معها كتيب إرشادات الإسعاف السريع.', warnings='افحص تواريخ الصلاحية للمطهرات سنوياً.',
                 alternatives='طقم إسعاف الجروح السريعة, شنطة إسعاف جدارية', icon='fa-solid fa-kit-medical')
    ]

    db.add_all(medicines)
    db.commit()
