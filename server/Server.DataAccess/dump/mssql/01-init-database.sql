-- MSSQL Database Initialization Script
-- Converted from MySQL dump for firmaDB
-- Database: firmaDB

USE master;
GO

-- Create database if it doesn't exist
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'firmaDB')
BEGIN
    CREATE DATABASE firmaDB;
END
GO

USE firmaDB;
GO

-- Drop tables if they exist (in correct order due to foreign keys)
IF OBJECT_ID('dbo.invoice_position', 'U') IS NOT NULL DROP TABLE dbo.invoice_position;
IF OBJECT_ID('dbo.contract_position', 'U') IS NOT NULL DROP TABLE dbo.contract_position;
IF OBJECT_ID('dbo.invoice', 'U') IS NOT NULL DROP TABLE dbo.invoice;
IF OBJECT_ID('dbo.contract', 'U') IS NOT NULL DROP TABLE dbo.contract;
IF OBJECT_ID('dbo.position', 'U') IS NOT NULL DROP TABLE dbo.position;
IF OBJECT_ID('dbo.customer2', 'U') IS NOT NULL DROP TABLE dbo.customer2;
IF OBJECT_ID('dbo.[transaction]', 'U') IS NOT NULL DROP TABLE dbo.[transaction];
IF OBJECT_ID('dbo.address', 'U') IS NOT NULL DROP TABLE dbo.address;
GO

-- Table structure for table 'address'
CREATE TABLE address (
    ADDRESS_ID INT IDENTITY(1,1) PRIMARY KEY,
    ZIP INT NULL,
    CITY VARCHAR(45) NULL,
    STREET VARCHAR(45) NULL,
    NR VARCHAR(45) NULL
);
GO

-- Table structure for table 'customer2'
CREATE TABLE customer2 (
    customerId INT IDENTITY(1,1) PRIMARY KEY,
    firstname VARCHAR(45) NOT NULL,
    surname VARCHAR(45) NOT NULL,
    plz INT NULL,
    city VARCHAR(45) NULL,
    address VARCHAR(45) NULL,
    nr INT NULL,
    uid VARCHAR(45) NULL
);
GO

-- Table structure for table 'position'
CREATE TABLE position (
    positionId INT IDENTITY(1,1) PRIMARY KEY,
    [text] VARCHAR(255) NOT NULL,
    price FLOAT NOT NULL,
    unit VARCHAR(45) NOT NULL
);
GO

-- Table structure for table 'contract'
CREATE TABLE contract (
    contractId INT IDENTITY(1,1) PRIMARY KEY,
    created_at DATE NOT NULL,
    accepted TINYINT NOT NULL,
    customerId INT NOT NULL,
    CONSTRAINT fk_contract_customer21 FOREIGN KEY (customerId) REFERENCES customer2(customerId)
);
GO

CREATE INDEX fk_contract_customer21_idx ON contract(customerId);
GO

-- Table structure for table 'contract_position'
CREATE TABLE contract_position (
    contractPositionId INT IDENTITY(1,1) PRIMARY KEY,
    amount FLOAT NOT NULL,
    contractId INT NOT NULL,
    positionId INT NOT NULL,
    CONSTRAINT fk_contract_position_contract1 FOREIGN KEY (contractId) REFERENCES contract(contractId),
    CONSTRAINT fk_contract_position_postition1 FOREIGN KEY (positionId) REFERENCES position(positionId)
);
GO

CREATE INDEX fk_contract_position_contract1_idx ON contract_position(contractId);
CREATE INDEX fk_contract_position_postition1_idx ON contract_position(positionId);
GO

-- Table structure for table 'invoice'
CREATE TABLE invoice (
    invoiceId INT IDENTITY(1,1) PRIMARY KEY,
    created_at DATE NOT NULL,
    customerId INT NOT NULL,
    started_at DATE NOT NULL,
    finished_at DATE NOT NULL,
    deposit_amount FLOAT NOT NULL,
    deposit_paid_on DATE NOT NULL,
    [type] CHAR(1) NOT NULL,
    CONSTRAINT fk_contract_customer210 FOREIGN KEY (customerId) REFERENCES customer2(customerId)
);
GO

CREATE INDEX fk_contract_customer21_idx ON invoice(customerId);
GO

-- Table structure for table 'invoice_position'
CREATE TABLE invoice_position (
    invoicePositionId INT IDENTITY(1,1) PRIMARY KEY,
    amount FLOAT NOT NULL,
    positionId INT NOT NULL,
    invoiceId INT NOT NULL,
    CONSTRAINT fk_contract_position_postition10 FOREIGN KEY (positionId) REFERENCES position(positionId),
    CONSTRAINT fk_invoice_position_invoice1 FOREIGN KEY (invoiceId) REFERENCES invoice(invoiceId) ON DELETE CASCADE ON UPDATE CASCADE
);
GO

CREATE INDEX fk_contract_position_postition1_idx ON invoice_position(positionId);
CREATE INDEX fk_invoice_position_invoice1_idx ON invoice_position(invoiceId);
GO

-- Table structure for table 'transaction'
CREATE TABLE [transaction] (
    transactionId INT IDENTITY(1,1) PRIMARY KEY,
    amount FLOAT NOT NULL,
    description VARCHAR(45) NOT NULL,
    [date] DATE NOT NULL,
    [type] CHAR(1) NOT NULL,
    medium VARCHAR(10) NOT NULL CHECK (medium IN ('CASH', 'CARD'))
);
GO
