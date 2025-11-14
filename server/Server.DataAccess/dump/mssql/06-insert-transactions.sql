-- MSSQL Data Insertion Script for Transactions
-- Insert data into transaction table for firmaDB

USE firmaDB;
GO

-- Set IDENTITY_INSERT ON for transaction
SET IDENTITY_INSERT [transaction] ON;
GO

-- Insert sample transaction data
INSERT INTO [transaction] (transactionId, amount, description, [date], [type], medium) VALUES
(1, 100, 'Kontoeröffnung', '2022-03-17', 'o', 'CARD'),
(2, 150, 'Einlage', '2022-03-17', 'i', 'CARD'),
(3, 138.98, 'Rechtschutz Versicherung Halbjährlich', '2022-03-17', 'o', 'CARD'),
(4, 138.98, 'Rechtschutz Versicherung Doppelbuchung ', '2022-03-22', 'o', 'CARD'),
(5, 2000, 'bareinlage', '2022-03-23', 'i', 'CASH'),
(6, 966.09, 'Haftpflichtversicherung', '2022-03-23', 'o', 'CARD'),
(7, 30.59, 'Sollzinsen Bereitstellung Kostenbeitrag', '2022-03-31', 'o', 'CARD'),
(8, 52.95, 'Vista Print Visitenkarten', '2022-04-12', 'o', 'CARD'),
(9, 200, 'Barabhebung  für Anmeldung L200', '2022-04-21', 'o', 'CARD'),
(10, 50, 'Barbehebung', '2022-04-21', 'o', 'CARD'),
(11, 85.77, 'Pagro ', '2022-04-21', 'o', 'CARD'),
(12, 10000, 'Bareinzahlung', '2022-04-21', 'i', 'CARD'),
(13, 10000, 'Anzahlung Auto Marko L200', '2022-04-21', 'o', 'CARD'),
(14, 90.24, 'Tanken L200 Griffen', '2022-04-21', 'o', 'CARD'),
(15, 81.48, 'Ikea Regal', '2022-04-22', 'o', 'CARD'),
(16, 1500, 'Barabhebung', '2022-04-25', 'o', 'CARD'),
(17, 15.72, 'Amazon', '2022-04-27', 'o', 'CARD'),
(18, 2000, 'Anzahlung Muhr', '2022-04-25', 'i', 'CARD'),
(19, 35.28, 'Amazon', '2022-04-27', 'o', 'CARD'),
(20, 90.56, 'Amazon', '2022-04-27', 'o', 'CARD'),
(21, 154.9, 'Amazon', '2022-04-27', 'o', 'CARD'),
(22, 420, 'Hojesch Kramer', '2022-04-30', 'o', 'CASH'),
(23, 827.54, 'Sadjak Beton Muhr', '2022-05-10', 'o', 'CARD'),
(24, 363.9, 'Zadruga Muhr', '2022-05-10', 'o', 'CARD'),
(25, 170, 'Vorsteuer', '2022-05-13', 'o', 'CARD'),
(26, 33, 'Walze ', '2022-05-21', 'o', 'CASH'),
(27, 660, 'Hojesch Kramer', '2022-05-23', 'o', 'CASH'),
(28, 350, 'WKO Vorschreibung', '2022-05-24', 'o', 'CARD'),
(29, 146.59, 'Sadjak Kies', '2022-05-24', 'o', 'CARD'),
(30, 1035, 'GK Erdbewegung', '2022-05-24', 'o', 'CARD'),
(31, 135.07, 'Jauntaler Kies', '2022-05-24', 'o', 'CARD'),
(32, 276.96, 'VAV Autoversicherung', '2022-05-03', 'o', 'CARD'),
(33, 870.92, 'Leasing plus Erstmalige Bereitstellung', '2022-05-04', 'o', 'CARD'),
(34, 117.08, 'A1 Internet', '2022-05-09', 'o', 'CARD'),
(35, 1700, 'Muhr Teilzahlung Rg ', '2022-05-23', 'i', 'CARD'),
(36, 8069.2, 'Teilbetrag Rechnung', '2022-05-24', 'i', 'CARD'),
(38, 200, 'Barbehebung', '2022-05-25', 'o', 'CARD'),
(39, 42.56, 'Sozialversicherungsbeitrag', '2022-05-31', 'o', 'CARD'),
(40, 376.54, 'Easy Leasing L200', '2022-06-01', 'o', 'CARD'),
(41, 185.2, 'VAV Autoversicherung', '2022-06-01', 'o', 'CARD'),
(42, 820.38, 'Schwab Tanken', '2022-06-02', 'o', 'CARD'),
(43, 35.28, 'Amazon', '2022-06-02', 'o', 'CARD'),
(44, 708.68, 'Mobiler Tank L200', '2022-06-07', 'o', 'CARD'),
(45, 117.95, 'Druckshirt', '2022-06-07', 'o', 'CARD'),
(46, 59.9, 'A1 Internet', '2022-06-10', 'o', 'CARD'),
(47, 38.9, 'Sadjak Beton', '2022-06-10', 'o', 'CARD'),
(48, 341.89, 'Handy ', '2022-06-10', 'o', 'CARD');
GO

SET IDENTITY_INSERT [transaction] OFF;
GO
