# دليل المنظومة المتكاملة - صيدلية الشفاء الذكية
## (Full-Stack Python Flask + Microsoft SQL Server + Admin RBAC)

تم بناء وبرمجة نظام متكامل احترافي لإدارة وتشغيل الصيدلية الإلكترونية، يربط بين واجهة المستخدم العصرية وخادم خلفي متين مبني بلغة **Python Flask** مع قاعدة بيانات **Microsoft SQL Server**، مدعوماً بلوحة تحكم متقدمة ونظام صلاحيات ثنائي محكم.

---

## 1. هيكل المشروع والملفات المنفذة

```
موقع صيدليه/
├── app.py                      # خادم Flask ومسارات الـ REST API والمصادقة
├── config.py                   # إعدادات الاتصال الآمن بـ SQL Server والبيئة
├── models.py                   # نماذج قاعدة البيانات (SQLAlchemy ORM Models)
├── database.py                 # إدارة الاتصال والتهيئة والحقن التلقائي للأدوية
├── schema_sqlserver.sql        # سكريبت إنشاء جداول SQL Server (T-SQL كامل)
├── backup_sqlserver.sql        # سكريبت النسخ الاحتياطي التلقائي والصيانة
├── requirements.txt            # مكتبات وحزم بايثون المطلوبة
├── .env                        # متغيرات البيئة المحلية النشطة
├── .env.example                # نموذج متغيرات البيئة للإنتاج والاستضافة
├── templates/
│   ├── index.html              # واجهة المتجر والصيدلية للجمهور
│   ├── login.html              # صفحة تسجيل الدخول الآمن للطاقم الطبي
│   └── admin.html              # لوحة تحكم المشرف والصيدلي (Dashboard)
└── static/
    ├── style.css               # نظام التصميم والوضع الليلي (Vanilla CSS)
    ├── app.js                  # المنطق البرمجي للواجهة والربط بالـ API
    ├── medicines-data.js       # قاعدة بيانات الأدوية والبدائل السريعة
    └── uploads/prescriptions/  # مجلد حفظ الروشتات الطبية المرفوعة
```

---

## 2. إنشاء وربط قاعدة بيانات Microsoft SQL Server

### أ) سكريبت الإنشاء (`schema_sqlserver.sql`)
تم تجهيز سكريبت T-SQL احترافي جاهز للتنفيذ المباشر في **SQL Server Management Studio (SSMS)**:
- يدعم ترميز اللغة العربية الكامل: `COLLATE Arabic_100_CI_AS`.
- **الجداول الأساسية**:
  1. `Roles`: جدول الأدوار (`admin`, `pharmacist`).
  2. `Users`: جدول المستخدمين بكلمات مرور مشفرة (`PBKDF2-SHA256`).
  3. `Categories`: الأقسام الطبية الـ 9.
  4. `Medicines`: جدول الأدوية (الاسم، التركيز، المادة الفعالة، البدائل، السعر، المخزون، الوصفة).
  5. `Orders`: جدول الطلبات وحالات الشحن (`pending`, `processing`, `out_for_delivery`, `delivered`, `cancelled`).
  6. `OrderItems`: تفاصيل الأصناف المحسوبة داخل كل طلب.
  7. `Prescriptions`: الروشتات الطبية المرفوعة وحالة فحصها واعتمادها.
  8. `AuditLogs`: سجل رقابي وتدقيقي لكل عمليات النظام وتعديلات الأسعار وحالات الطلبات مع IP.

### ب) سلسلة الاتصال بـ SQL Server (`.env` & `config.py`)
للربط مع خادم SQL Server محلي أو سحابي (Azure SQL / AWS RDS):
```ini
# إذا كان الخادم على نفس الجهاز بحساب Windows Authentication:
SQL_SERVER_URI=mssql+pyodbc://localhost/ShefaaPharmacyDB?driver=ODBC+Driver+17+for+SQL+Server&trusted_connection=yes

# إذا كان الاتصال باسم مستخدم sa وكلمة مرور:
SQL_SERVER_URI=mssql+pyodbc://sa:YourStrongPassword@localhost:1433/ShefaaPharmacyDB?driver=ODBC+Driver+17+for+SQL+Server
```
> [!TIP]
> يحتوي النظام على **Smart Fallback** مدمج: إذا لم يكن SQL Server مشغلاً بعد، ينتقل التطبيق تلقائياً إلى قاعدة بيانات SQLite محلية فورية `shefaa_pharmacy.db` ليعمل الموقع بدون أي توقف أو انهيار.

---

## 3. خادم Python Flask وواجهات الـ REST API

تم بناء الخادم الخلفي `app.py` وتغطيته بكافة العمليات:

| المسار (Endpoint) | الطريقة | الوصف | الصلاحية المطلوبة |
| :--- | :---: | :--- | :--- |
| `/api/auth/login` | `POST` | تسجيل دخول آمن والتحقق من كلمة المرور المشفرة | للجميع |
| `/api/auth/logout` | `POST` | إنهاء الجلسة ومسح الكوكيز الآمنة | مستخدم مسجل |
| `/api/auth/me` | `GET` | التحقق من المستخدم الحالي وصلاحياته النشطة | مستخدم مسجل |
| `/api/products` | `GET` | جلب الأدوية مع دعم البحث والفلترة حسب القسم | متاح للجميع |
| `/api/products` | `POST` | إضافة دواء جديد للمنظومة | المدير العام (`admin`) |
| `/api/products/<id>` | `PUT` | تحديث بيانات الدواء وسعره والمخزون | المدير أو الصيدلي |
| `/api/products/<id>` | `DELETE` | حذف وتعطيل صنف دوائي (Soft Delete) | المدير العام فقط |
| `/api/orders` | `POST` | إنشاء طلب شراء جديد، حساب الخصومات وخصم المخزون | الجمهور / العملاء |
| `/api/orders` | `GET` | استعراض كافة الطلبات للعملاء | الصيدلي والمدير |
| `/api/orders/<id>/status` | `PUT` | تحديث حالة الطلب والتوصيل | الصيدلي والمدير |
| `/api/prescriptions` | `POST` | رفع صورة الروشتة الطبية وتخزينها | الجمهور / العملاء |
| `/api/prescriptions` | `GET` | عرض الروشتات الطبية الواردة للمراجعة | الصيدلي والمدير |
| `/api/prescriptions/<id>/status` | `PUT` | اعتماد أو رفض الروشتة وتدوين الملاحظات | الصيدلي والمدير |
| `/api/admin/stats` | `GET` | مؤشرات الأداء (المبيعات، الطلبات، النواقص) | الصيدلي والمدير |
| `/api/admin/audit-logs` | `GET` | سجل التدقيق والرقابة وتتبع العمليات | المدير العام فقط |

---

## 4. نظام الصلاحيات لشخصين (Role-Based Access Control)

تم تطبيق نظام أمني صارم يفصل بين المسؤوليات عبر ديكوريتور `@role_required`:

### 1) المدير العام (Super Admin):
- **اسم المستخدم**: `admin`
- **كلمة المرور**: `AdminPassword@2026`
- **الصلاحيات**:
  - الاطلاع على الأرقام المالية والمبيعات الإجمالية.
  - إضافة أصناف دوائية جديدة وحذف الأدوية.
  - استعراض وتحديث كافة الطلبات والروشتات.
  - صلاحية حصرية لمراجعة **سجل الرقابة والتتبع (Security Audit Trail)** ومراقبة أي تغييرات بالأسعار أو الحالات مع توقيتاتها وعناوين الـ IP.

### 2) الصيدلي المناوب (Staff Pharmacist):
- **اسم المستخدم**: `pharmacist`
- **كلمة المرور**: `Pharmacist@2026`
- **الصلاحيات**:
  - مراجعة الروشتات الطبية المرفوعة (اعتماد / رفض / تدوين أصناف بديلة).
  - تحديث حالات توصيل الطلبات (`قيد التجهيز`، `في الطريق`، `تم التسليم`).
  - تحديث كميات المخزون وتعديل الأسعار عند اللزوم.
  - **محظور عليه**: حذف الأصناف الدوائية نهائياً، أو الاطلاع على سجل الرقابة والحسابات الإدارية الحساسة.

---

## 5. تشغيل الموقع محلياً (Local Development)

### الخطوة 1: تثبيت الحزم المطلوبة
افتح موجه الأوامر (Terminal / PowerShell) داخل مجلد المشروع ونفذ:
```bash
pip install -r requirements.txt
```

### الخطوة 2: تشغيل الخادم الخلفي
```bash
python app.py
```

### الخطوة 3: الروابط المتاحة فور التشغيل
- **واجهة الصيدلية والمتجر للعملاء**: [http://localhost:5000/](http://localhost:5000/)
- **صفحة تسجيل الدخول**: [http://localhost:5000/login](http://localhost:5000/login)
- **لوحة تحكم الإدارة والصيدلي**: [http://localhost:5000/admin](http://localhost:5000/admin)

---

## 6. رفع الموقع على Hosting وربط النطاق (Domain Binding)

### الخيار الأول: الاستضافة على VPS أو خادم سحابي (Ubuntu / Debian)
1. **تثبيت المتطلبات**:
   ```bash
   sudo apt update && sudo apt install -y python3-pip python3-venv nginx
   ```
2. **إعداد خادم WSGI (Gunicorn)**:
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 127.0.0.1:5000 app:app
   ```
3. **تهيئة Nginx كـ Reverse Proxy**:
   قم بإنشاء ملف `/etc/nginx/sites-available/shefaa`:
   ```nginx
   server {
       server_name shefaa-pharmacy.com www.shefaa-pharmacy.com;

       location / {
           proxy_pass http://127.0.0.1:5000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }

       location /static {
           alias /var/www/shefaa/static;
           expires 30d;
       }
   }
   ```
4. **تفعيل الموقع وإعادة تشغيل Nginx**:
   ```bash
   sudo ln -s /etc/nginx/sites-available/shefaa /etc/nginx/sites-enabled/
   sudo nginx -t && sudo systemctl restart nginx
   ```

### الخيار الثاني: الاستضافة السحابية السريعة (Render / PythonAnywhere)
- أنشئ حساباً على **Render.com** أو **PythonAnywhere**.
- اختر **Web Service** واربط مستودع Git الخاص بك.
- في خانة **Start Command** اكتب:
  ```bash
  gunicorn app:app
  ```
- في خانة **Environment Variables** أضف المتغيرات من ملف `.env.example`.

### ربط الدومين (Custom Domain Configuration):
1. افتح لوحة تحكم مزود الدومين الخاص بك (GoDaddy, Namecheap, Cloudflare).
2. انتقل إلى **DNS Management** وأضف السجلات التالية:
   - **سجل A (A Record)**:
     - `Host`: `@`
     - `Points to`: عنوان الـ IP الثابت لخادم الاستضافة الخاص بك (مثل `192.0.2.1`).
   - **سجل CNAME (CNAME Record)**:
     - `Host`: `www`
     - `Points to`: `shefaa-pharmacy.com` أو الرابط الممنوح من Render.
3. **تفعيل شهادة الأمان المجانية (SSL / HTTPS)**:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d shefaa-pharmacy.com -d www.shefaa-pharmacy.com
   ```

---

## 7. حماية البيانات والنسخ الاحتياطي (Data Protection & Backup)

### أ) سياسة النسخ الاحتياطي التلقائي (`backup_sqlserver.sql`)
- تم تجهيز الإجراءات المخزنة:
  1. `sp_Backup_Shefaa_Full`: نسخ احتياطي شامل مضغوط (Compression + Checksum) يتم جدولته يومياً في ساعات الهدوء (02:00 صباحاً).
  2. `sp_Backup_Shefaa_Diff`: نسخ تفاضلي كل 6 ساعات لحفظ التغييرات الجديدة في الطلبات والروشتات.
  3. `sp_Restore_Shefaa`: إجراء استعادة فوري لقاعدة البيانات في حالات الطوارئ (Disaster Recovery).

### ب) معايير الحماية والتأمين المطبقة (Security Best Practices):
1. **تشفير كلمات المرور**: استخدام خوارزمية `PBKDF2-SHA256` مع Salt عشوائي فريد لكل مستخدم.
2. **الحماية من حقن الاستعلامات (SQL Injection)**: استخدام تقنية الاستعلامات المعلمية (Parameterized Queries) بالكامل عبر SQLAlchemy ORM، مما يمنع تمرير نصوص برمجية خبيثة داخل قواعد البيانات.
3. **حماية الجلسات والـ Cookies**:
   - `SESSION_COOKIE_HTTPONLY = True` لمنع سرقة الجلسة عبر هجمات XSS.
   - `SESSION_COOKIE_SAMESITE = 'Lax'` لمنع هجمات تزوير الطلبات عبر المواقع (CSRF).
4. **سجل الرقابة الطبية والأمنية (Audit Trail)**: كل محاولة تسجيل دخول، تعديل أسعار الأدوية، أو تغيير لحالة الطلبات يتم تسجيلها آلياً مع التوقيت وعنوان الـ IP داخل جدول `AuditLogs`.
