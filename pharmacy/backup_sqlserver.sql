-- ============================================================================
-- صيدلية الشفاء الذكية - سكريبت النسخ الاحتياطي التلقائي وصيانة البيانات
-- Microsoft SQL Server Automated Backup & Maintenance Plan
-- ============================================================================

USE master;
GO

-- 1. إجراء مخزن للنسخ الاحتياطي الكامل (Full Backup) مع التاريخ والوقت
IF OBJECT_ID(N'dbo.sp_Backup_Shefaa_Full', N'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_Backup_Shefaa_Full;
GO

CREATE PROCEDURE dbo.sp_Backup_Shefaa_Full
    @BackupDirectory NVARCHAR(255) = N'C:\Backups\ShefaaPharmacy\'
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @FileName NVARCHAR(500);
    DECLARE @DateTimeString NVARCHAR(50);
    DECLARE @BackupName NVARCHAR(255);

    -- توليد صيغة الوقت والتاريخ: YYYYMMDD_HHMMSS
    SET @DateTimeString = REPLACE(REPLACE(REPLACE(CONVERT(NVARCHAR(20), GETDATE(), 120), '-', ''), ' ', '_'), ':', '');
    SET @FileName = @BackupDirectory + N'ShefaaPharmacy_Full_' + @DateTimeString + N'.bak';
    SET @BackupName = N'ShefaaPharmacy Full Backup ' + @DateTimeString;

    PRINT N'بدء فحص تكامل قاعدة البيانات قبل النسخ الاحتياطي...';
    DBCC CHECKDB (N'ShefaaPharmacyDB') WITH NO_INFOMSGS;

    PRINT N'جاري تنفيذ النسخ الاحتياطي الكامل إلى: ' + @FileName;
    BACKUP DATABASE ShefaaPharmacyDB
    TO DISK = @FileName
    WITH FORMAT,
         INIT,
         NAME = @BackupName,
         COMPRESSION,      -- ضغط حجم النسخة الاحتياطية بنسبة تصل إلى 70%
         CHECKSUM,         -- التحقق من صحة البيانات أثناء النسخ
         STATS = 10;

    PRINT N'تم إتمام النسخ الاحتياطي الكامل بنجاح!';
END;
GO

-- 2. إجراء مخزن للنسخ الاحتياطي التفاضلي (Differential Backup)
IF OBJECT_ID(N'dbo.sp_Backup_Shefaa_Diff', N'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_Backup_Shefaa_Diff;
GO

CREATE PROCEDURE dbo.sp_Backup_Shefaa_Diff
    @BackupDirectory NVARCHAR(255) = N'C:\Backups\ShefaaPharmacy\'
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @FileName NVARCHAR(500);
    DECLARE @DateTimeString NVARCHAR(50);

    SET @DateTimeString = REPLACE(REPLACE(REPLACE(CONVERT(NVARCHAR(20), GETDATE(), 120), '-', ''), ' ', '_'), ':', '');
    SET @FileName = @BackupDirectory + N'ShefaaPharmacy_Diff_' + @DateTimeString + N'.bak';

    PRINT N'جاري تنفيذ النسخ التفاضلي إلى: ' + @FileName;
    BACKUP DATABASE ShefaaPharmacyDB
    TO DISK = @FileName
    WITH DIFFERENTIAL,
         FORMAT,
         INIT,
         COMPRESSION,
         CHECKSUM,
         STATS = 10;

    PRINT N'تم إتمام النسخ التفاضلي بنجاح!';
END;
GO

-- 3. إجراء استعادة قاعدة البيانات في حالات الطوارئ (Disaster Recovery Restore)
IF OBJECT_ID(N'dbo.sp_Restore_Shefaa', N'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_Restore_Shefaa;
GO

CREATE PROCEDURE dbo.sp_Restore_Shefaa
    @FullBackupFilePath NVARCHAR(500)
AS
BEGIN
    SET NOCOUNT ON;
    
    PRINT N'جاري إغلاق الاتصالات النشطة بالقاعدة...';
    ALTER DATABASE ShefaaPharmacyDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;

    PRINT N'جاري استعادة قاعدة البيانات من: ' + @FullBackupFilePath;
    RESTORE DATABASE ShefaaPharmacyDB
    FROM DISK = @FullBackupFilePath
    WITH REPLACE,
         RECOVERY,
         STATS = 10;

    ALTER DATABASE ShefaaPharmacyDB SET MULTI_USER;
    PRINT N'تمت استعادة قاعدة البيانات بنجاح وعودتها للعمل!';
END;
GO

-- ============================================================================
-- خطة الصيانة المقترحة (Recommended Maintenance Schedule):
-- 1. Full Backup: يومياً الساعة 02:00 صباحاً (عند انخفاض الضغط).
-- 2. Differential Backup: كل 6 ساعات خلال أوقات العمل.
-- 3. الاحتفاظ بالنسخ الاحتياطية لمدة 30 يوماً مع نقل نسخة منها إلى Cloud Storage (Azure / AWS S3 / Google Drive).
-- ============================================================================
