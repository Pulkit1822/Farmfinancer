IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20251027170204_ip')
BEGIN
    CREATE TABLE [Loans] (
        [LoanId] int NOT NULL IDENTITY,
        [LoanType] nvarchar(max) NOT NULL,
        [Description] nvarchar(max) NOT NULL,
        [InterestRate] decimal(18,2) NOT NULL,
        [MaximumAmount] decimal(18,2) NOT NULL,
        [RepaymentTenure] int NOT NULL,
        [Eligibility] nvarchar(max) NOT NULL,
        [DocumentsRequired] nvarchar(max) NOT NULL,
        CONSTRAINT [PK_Loans] PRIMARY KEY ([LoanId])
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20251027170204_ip')
BEGIN
    CREATE TABLE [Users] (
        [UserId] int NOT NULL IDENTITY,
        [Email] nvarchar(max) NOT NULL,
        [Password] nvarchar(max) NOT NULL,
        [Username] nvarchar(max) NOT NULL,
        [MobileNumber] nvarchar(max) NOT NULL,
        [UserRole] nvarchar(max) NOT NULL,
        CONSTRAINT [PK_Users] PRIMARY KEY ([UserId])
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20251027170204_ip')
BEGIN
    CREATE TABLE [Feedbacks] (
        [FeedbackId] int NOT NULL IDENTITY,
        [UserId] int NOT NULL,
        [FeedbackText] nvarchar(max) NOT NULL,
        [Date] datetime2 NOT NULL,
        CONSTRAINT [PK_Feedbacks] PRIMARY KEY ([FeedbackId]),
        CONSTRAINT [FK_Feedbacks_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([UserId]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20251027170204_ip')
BEGIN
    CREATE TABLE [LoanApplications] (
        [LoanApplicationId] int NOT NULL IDENTITY,
        [UserId] int NOT NULL,
        [LoanId] int NOT NULL,
        [SubmissionDate] datetime2 NOT NULL,
        [LoanStatus] int NOT NULL,
        [FarmLocation] nvarchar(max) NOT NULL,
        [FarmerAddress] nvarchar(max) NOT NULL,
        [FarmSizeInAcres] decimal(18,2) NOT NULL,
        [FarmPurpose] nvarchar(max) NOT NULL,
        [File] nvarchar(max) NOT NULL,
        CONSTRAINT [PK_LoanApplications] PRIMARY KEY ([LoanApplicationId]),
        CONSTRAINT [FK_LoanApplications_Loans_LoanId] FOREIGN KEY ([LoanId]) REFERENCES [Loans] ([LoanId]) ON DELETE CASCADE,
        CONSTRAINT [FK_LoanApplications_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([UserId]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20251027170204_ip')
BEGIN
    CREATE INDEX [IX_Feedbacks_UserId] ON [Feedbacks] ([UserId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20251027170204_ip')
BEGIN
    CREATE INDEX [IX_LoanApplications_LoanId] ON [LoanApplications] ([LoanId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20251027170204_ip')
BEGIN
    CREATE INDEX [IX_LoanApplications_UserId] ON [LoanApplications] ([UserId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20251027170204_ip')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20251027170204_ip', N'6.0.0');
END;
GO

COMMIT;
GO

