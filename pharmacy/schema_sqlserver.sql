-- ============================================================================
-- صيدلية الشفاء الذكية - قاعدة بيانات Microsoft SQL Server
-- Shefaa Smart Pharmacy - Production Database Schema (T-SQL)
-- ============================================================================

USE master;
GO

-- 1. إنشاء قاعدة البيانات إذا لم تكن موجودة
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'ShefaaPharmacyDB')
BEGIN
    CREATE DATABASE ShefaaPharmacyDB
    COLLATE Arabic_100_CI_AS; -- دعم اللغة العربية الكامل مع البحث غير الحساس لحالة الأحرف
    PRINT N'تم إنشاء قاعدة البيانات ShefaaPharmacyDB بنجاح.';
END
GO

USE ShefaaPharmacyDB;
GO

-- ============================================================================
-- 2. جدول الأدوار والصلاحيات (Roles Table)
-- ============================================================================
IF OBJECT_ID(N'dbo.Roles', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Roles (
        RoleId INT IDENTITY(1,1) PRIMARY KEY,
        RoleName NVARCHAR(50) NOT NULL UNIQUE,       -- 'admin', 'pharmacist'
        DisplayName NVARCHAR(100) NOT NULL,          -- 'المدير العام', 'الصيدلي المناوب'
        Description NVARCHAR(255) NULL,
        CreatedAt DATETIME2 DEFAULT SYSDATETIME()
    );
    PRINT N'تم إنشاء جدول الأدوار Roles بنجاح.';
END
GO

-- ============================================================================
-- 3. جدول المستخدمين (Users Table - Secure Authentication)
-- ============================================================================
IF OBJECT_ID(N'dbo.Users', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Users (
        UserId INT IDENTITY(1,1) PRIMARY KEY,
        Username NVARCHAR(50) NOT NULL UNIQUE,
        FullName NVARCHAR(150) NOT NULL,
        Email NVARCHAR(150) NOT NULL UNIQUE,
        PasswordHash NVARCHAR(255) NOT NULL,         -- كلمة مرور مشفرة بـ PBKDF2-SHA256
        RoleId INT NOT NULL,
        PhoneNumber NVARCHAR(20) NULL,
        IsActive BIT NOT NULL DEFAULT 1,
        LastLogin DATETIME2 NULL,
        CreatedAt DATETIME2 DEFAULT SYSDATETIME(),
        CONSTRAINT FK_Users_Roles FOREIGN KEY (RoleId) REFERENCES dbo.Roles(RoleId)
    );
    CREATE NONCLUSTERED INDEX IX_Users_Username ON dbo.Users(Username);
    CREATE NONCLUSTERED INDEX IX_Users_Email ON dbo.Users(Email);
    PRINT N'تم إنشاء جدول المستخدمين Users بنجاح.';
END
GO

-- ============================================================================
-- 4. جدول الأقسام الطبية (Categories Table)
-- ============================================================================
IF OBJECT_ID(N'dbo.Categories', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Categories (
        CategoryId NVARCHAR(50) PRIMARY KEY,          -- 'pain_fever', 'antibiotics', ...
        NameAr NVARCHAR(100) NOT NULL,
        Icon NVARCHAR(50) NOT NULL DEFAULT 'fa-solid fa-pills',
        SortOrder INT NOT NULL DEFAULT 0,
        CreatedAt DATETIME2 DEFAULT SYSDATETIME()
    );
    PRINT N'تم إنشاء جدول الأقسام Categories بنجاح.';
END
GO

-- ============================================================================
-- 5. جدول الأدوية والمنتجات (Medicines / Products Table)
-- ============================================================================
IF OBJECT_ID(N'dbo.Medicines', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Medicines (
        MedicineId NVARCHAR(50) PRIMARY KEY,         -- 'med-01', 'med-02', ...
        NameAr NVARCHAR(200) NOT NULL,
        NameEn NVARCHAR(200) NOT NULL,
        CategoryId NVARCHAR(50) NOT NULL,
        ActiveIngredient NVARCHAR(300) NOT NULL,
        Form NVARCHAR(100) NOT NULL,                 -- 'أقراص', 'شراب', 'بخاخ', ...
        Price DECIMAL(10, 2) NOT NULL CHECK (Price >= 0),
        OldPrice DECIMAL(10, 2) NULL CHECK (OldPrice >= 0),
        RequiresPrescription BIT NOT NULL DEFAULT 0, -- 1 = Rx (وصفة), 0 = OTC
        StockCount INT NOT NULL DEFAULT 0 CHECK (StockCount >= 0),
        Rating DECIMAL(2, 1) NOT NULL DEFAULT 5.0 CHECK (Rating >= 1.0 AND Rating <= 5.0),
        ReviewsCount INT NOT NULL DEFAULT 0,
        Badge NVARCHAR(50) NULL,
        BadgeType NVARCHAR(30) NULL DEFAULT 'normal',
        Indications NVARCHAR(MAX) NOT NULL,
        Dosage NVARCHAR(MAX) NOT NULL,
        Warnings NVARCHAR(MAX) NOT NULL,
        Alternatives NVARCHAR(MAX) NULL,             -- قائمة البدائل مفصولة بفاصلة
        Icon NVARCHAR(50) DEFAULT 'fa-solid fa-capsules',
        IsActive BIT NOT NULL DEFAULT 1,
        CreatedAt DATETIME2 DEFAULT SYSDATETIME(),
        UpdatedAt DATETIME2 DEFAULT SYSDATETIME(),
        CONSTRAINT FK_Medicines_Categories FOREIGN KEY (CategoryId) REFERENCES dbo.Categories(CategoryId)
    );
    CREATE NONCLUSTERED INDEX IX_Medicines_Category ON dbo.Medicines(CategoryId);
    CREATE NONCLUSTERED INDEX IX_Medicines_NameAr ON dbo.Medicines(NameAr);
    PRINT N'تم إنشاء جدول الأدوية Medicines بنجاح.';
END
GO

-- ============================================================================
-- 6. جدول طلبات الشراء (Orders Table)
-- ============================================================================
IF OBJECT_ID(N'dbo.Orders', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Orders (
        OrderId INT IDENTITY(1,1) PRIMARY KEY,
        OrderNumber NVARCHAR(30) NOT NULL UNIQUE,     -- 'SHF-982341'
        CustomerName NVARCHAR(150) NOT NULL,
        CustomerPhone NVARCHAR(20) NOT NULL,
        CustomerAddress NVARCHAR(300) NOT NULL,
        PaymentMethod NVARCHAR(100) NOT NULL,
        Subtotal DECIMAL(10, 2) NOT NULL,
        ShippingFee DECIMAL(10, 2) NOT NULL DEFAULT 0,
        DiscountAmount DECIMAL(10, 2) NOT NULL DEFAULT 0,
        TotalAmount DECIMAL(10, 2) NOT NULL,
        OrderStatus NVARCHAR(30) NOT NULL DEFAULT 'pending', 
        -- 'pending' (قيد المراجعة), 'processing' (قيد التجهيز), 'out_for_delivery' (في الطريق), 'delivered' (تم التسليم), 'cancelled' (ملغي)
        Notes NVARCHAR(500) NULL,
        PrescriptionImage NVARCHAR(300) NULL,
        CreatedAt DATETIME2 DEFAULT SYSDATETIME(),
        UpdatedAt DATETIME2 DEFAULT SYSDATETIME()
    );
    CREATE NONCLUSTERED INDEX IX_Orders_OrderNumber ON dbo.Orders(OrderNumber);
    CREATE NONCLUSTERED INDEX IX_Orders_Status ON dbo.Orders(OrderStatus);
    PRINT N'تم إنشاء جدول الطلبات Orders بنجاح.';
END
GO

-- ============================================================================
-- 7. جدول تفاصيل الطلبات (Order Items Table)
-- ============================================================================
IF OBJECT_ID(N'dbo.OrderItems', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.OrderItems (
        OrderItemId INT IDENTITY(1,1) PRIMARY KEY,
        OrderId INT NOT NULL,
        MedicineId NVARCHAR(50) NOT NULL,
        MedicineName NVARCHAR(200) NOT NULL,
        Quantity INT NOT NULL CHECK (Quantity > 0),
        UnitPrice DECIMAL(10, 2) NOT NULL,
        TotalPrice AS (Quantity * UnitPrice) PERSISTED,
        CONSTRAINT FK_OrderItems_Orders FOREIGN KEY (OrderId) REFERENCES dbo.Orders(OrderId) ON DELETE CASCADE,
        CONSTRAINT FK_OrderItems_Medicines FOREIGN KEY (MedicineId) REFERENCES dbo.Medicines(MedicineId)
    );
    CREATE NONCLUSTERED INDEX IX_OrderItems_OrderId ON dbo.OrderItems(OrderId);
    PRINT N'تم إنشاء جدول تفاصيل الطلبات OrderItems بنجاح.';
END
GO

-- ============================================================================
-- 8. جدول الروشتات الطبية المرفوعة (Prescriptions Table)
-- ============================================================================
IF OBJECT_ID(N'dbo.Prescriptions', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Prescriptions (
        PrescriptionId INT IDENTITY(1,1) PRIMARY KEY,
        PrescriptionCode NVARCHAR(30) NOT NULL UNIQUE, -- 'RX-849102'
        CustomerPhone NVARCHAR(20) NOT NULL,
        CustomerAddress NVARCHAR(300) NOT NULL,
        Notes NVARCHAR(500) NULL,
        ImagePath NVARCHAR(300) NOT NULL,
        Status NVARCHAR(30) NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'completed'
        ReviewedBy INT NULL,                           -- معرف الصيدلي الذي فحص الروشتة
        PharmacistNotes NVARCHAR(500) NULL,
        CreatedAt DATETIME2 DEFAULT SYSDATETIME(),
        UpdatedAt DATETIME2 DEFAULT SYSDATETIME(),
        CONSTRAINT FK_Prescriptions_ReviewedBy FOREIGN KEY (ReviewedBy) REFERENCES dbo.Users(UserId)
    );
    CREATE NONCLUSTERED INDEX IX_Prescriptions_Status ON dbo.Prescriptions(Status);
    PRINT N'تم إنشاء جدول الروشتات Prescriptions بنجاح.';
END
GO

-- ============================================================================
-- 9. جدول سجل تدقيق العمليات (Audit Logs Table - Security & Compliance)
-- ============================================================================
IF OBJECT_ID(N'dbo.AuditLogs', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.AuditLogs (
        LogId INT IDENTITY(1,1) PRIMARY KEY,
        UserId INT NULL,
        Username NVARCHAR(50) NULL,
        Action NVARCHAR(100) NOT NULL,                -- 'LOGIN', 'UPDATE_PRODUCT', 'CHANGE_ORDER_STATUS'
        EntityName NVARCHAR(50) NOT NULL,             -- 'Medicines', 'Orders', 'Users'
        EntityId NVARCHAR(50) NULL,
        Details NVARCHAR(MAX) NULL,
        IpAddress NVARCHAR(50) NULL,
        CreatedAt DATETIME2 DEFAULT SYSDATETIME()
    );
    CREATE NONCLUSTERED INDEX IX_AuditLogs_CreatedAt ON dbo.AuditLogs(CreatedAt DESC);
    PRINT N'تم إنشاء جدول سجل العمليات AuditLogs بنجاح.';
END
GO

-- ============================================================================
-- 10. البيانات الافتراضية (Seed Data)
-- ============================================================================

-- إضافة الأدوار
IF NOT EXISTS (SELECT 1 FROM dbo.Roles WHERE RoleName = 'admin')
BEGIN
    INSERT INTO dbo.Roles (RoleName, DisplayName, Description)
    VALUES 
    (N'admin', N'المدير العام', N'صلاحيات كاملة لإدارة النظام والمنتجات والمستخدمين والإحصائيات والنسخ الاحتياطي'),
    (N'pharmacist', N'الصيدلي المناوب', N'صلاحيات مراجعة الروشتات وتجهيز الطلبات وتحديث حالتها ومتابعة المخزون');
    PRINT N'تمت إضافة الأدوار الافتراضية بنجاح.';
END
GO

-- إضافة الحسابات الافتراضية بكلمات مرور مشفرة (PBKDF2-SHA256)
-- admin: AdminPassword@2026
-- pharmacist: Pharmacist@2026
IF NOT EXISTS (SELECT 1 FROM dbo.Users WHERE Username = 'admin')
BEGIN
    DECLARE @AdminRoleId INT = (SELECT RoleId FROM dbo.Roles WHERE RoleName = 'admin');
    DECLARE @PharmacistRoleId INT = (SELECT RoleId FROM dbo.Roles WHERE RoleName = 'pharmacist');

    INSERT INTO dbo.Users (Username, FullName, Email, PasswordHash, RoleId, PhoneNumber)
    VALUES 
    (N'admin', N'د. أحمد سالم (مدير الصيدلية)', N'admin@shefaa.com', 
     N'pbkdf2:sha256:600000$p9E10vYtZ$948b8bbf40e02eb4d57c32bfcb9d8544e99f0be8d5d43ecfc925bc06bbba2419', 
     @AdminRoleId, N'01000000001'),
    (N'pharmacist', N'د. سارة محمود (صيدلي مناوب)', N'pharmacist@shefaa.com', 
     N'pbkdf2:sha256:600000$x8R32vKpM$38c362be81fa15c32af994da54e60b2ebcf91c0e9f1a23e9cb45279b91ec8763', 
     @PharmacistRoleId, N'01000000002');
    PRINT N'تمت إضافة المستخدمين الافتراضيين بنجاح.';
END
GO

-- إضافة الأقسام الطبية
IF NOT EXISTS (SELECT 1 FROM dbo.Categories WHERE CategoryId = 'pain_fever')
BEGIN
    INSERT INTO dbo.Categories (CategoryId, NameAr, Icon, SortOrder)
    VALUES 
    (N'pain_fever', N'مسكنات وخافضات حرارة', N'fa-solid fa-head-side-virus', 1),
    (N'antibiotics', N'مضادات حيوية ومطهرات', N'fa-solid fa-shield-virus', 2),
    (N'digestive', N'الجهاز الهضمي والمعدة', N'fa-solid fa-stethoscope', 3),
    (N'respiratory', N'الحساسية والجهاز التنفسي', N'fa-solid fa-lungs', 4),
    (N'chronic', N'الضغط والقلب والسكر', N'fa-solid fa-heart-pulse', 5),
    (N'vitamins', N'فيتامينات ومكملات غذائية', N'fa-solid fa-apple-whole', 6),
    (N'skin_hair', N'العناية بالبشرة والشعر', N'fa-solid fa-spa', 7),
    (N'pediatrics', N'صحة ورعاية الأطفال', N'fa-solid fa-baby', 8),
    (N'medical_supplies', N'مستلزمات وأجهزة طبية', N'fa-solid fa-kit-medical', 9);
    PRINT N'تمت إضافة الأقسام الطبية بنجاح.';
END
GO

PRINT N'اكتمل إنشاء وتجهيز مخطط قاعدة بيانات صيدلية الشفاء بنجاح!';
GO
