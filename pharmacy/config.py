import os
from pathlib import Path
from dotenv import load_dotenv

# تحميل متغيرات البيئة من ملف .env إن وجد
BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / '.env')

class Config:
    """إعدادات تشغيل التطبيق وقاعدة البيانات"""
    SECRET_KEY = os.getenv('SECRET_KEY', 'shefaa-super-secure-pharmacy-secret-key-2026')
    
    # خيار الاتصال بقاعدة بيانات Microsoft SQL Server
    # مثال: mssql+pyodbc://sa:YourPassword@localhost/ShefaaPharmacyDB?driver=ODBC+Driver+17+for+SQL+Server
    SQL_SERVER_URI = os.getenv('SQL_SERVER_URI', '')
    
    # خيار قاعدة بيانات محلية مرنة كبديل جاهز للتشغيل الفوري (SQLite)
    SQLITE_URI = f"sqlite:///{BASE_DIR / 'shefaa_pharmacy.db'}"
    
    # تحديد مصدر قاعدة البيانات (SQL Server أو البديل التلقائي)
    SQLALCHEMY_DATABASE_URI = SQL_SERVER_URI if SQL_SERVER_URI else SQLITE_URI
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # مجلد رفع الروشتات الطبية
    UPLOAD_FOLDER = BASE_DIR / 'static' / 'uploads' / 'prescriptions'
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB max upload
    
    # إعدادات جلسات تسجيل الدخول الآمنة
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    PERMANENT_SESSION_LIFETIME = 86400  # 24 ساعة
