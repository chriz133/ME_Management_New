-- MSSQL Data Insertion Script for Contracts
-- Insert data into contract table for firmaDB

USE firmaDB;
GO

-- Set IDENTITY_INSERT ON for contract
SET IDENTITY_INSERT contract ON;
GO

-- Insert sample contract data
INSERT INTO contract (contractId, created_at, accepted, customerId) VALUES
(1, '2022-05-22', 0, 1),
(2, '2022-05-27', 0, 2),
(3, '2022-06-24', 0, 3),
(4, '2022-11-20', 0, 8),
(5, '2022-11-20', 0, 8),
(6, '2023-03-08', 0, 9),
(7, '2023-03-08', 0, 10),
(8, '2023-04-10', 0, 12),
(9, '2023-05-13', 0, 14),
(10, '2023-05-14', 0, 15),
(11, '2023-05-14', 0, 14),
(12, '2023-05-14', 0, 15),
(13, '2023-07-20', 0, 12),
(14, '2023-09-03', 0, 21),
(15, '2023-09-03', 0, 22),
(16, '2024-08-16', 0, 26),
(17, '2025-06-17', 0, 30),
(18, '2025-06-17', 0, 30);
GO

SET IDENTITY_INSERT contract OFF;
GO

-- Set IDENTITY_INSERT ON for contract_position
SET IDENTITY_INSERT contract_position ON;
GO

-- Insert sample contract_position data
INSERT INTO contract_position (contractPositionId, amount, contractId, positionId) VALUES
(1, 1, 1, 1),
(2, 207, 2, 15),
(3, 32, 2, 16),
(4, 5, 2, 17),
(5, 15, 2, 18),
(6, 50, 2, 19),
(7, 25, 2, 20),
(8, 1, 2, 21),
(9, 1, 2, 22),
(10, 7, 2, 23),
(11, 11, 3, 24),
(22, 9, 6, 71),
(23, 30, 6, 72),
(24, 20, 6, 73),
(25, 80, 6, 74),
(26, 12, 6, 75),
(27, 1, 6, 76),
(28, 3, 6, 77),
(36, 1, 6, 85),
(37, 1, 6, 86),
(55, 90, 9, 127),
(56, 90, 9, 128),
(63, 1, 10, 135),
(64, 45, 11, 136);
GO

SET IDENTITY_INSERT contract_position OFF;
GO
