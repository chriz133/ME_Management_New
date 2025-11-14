-- MSSQL Data Insertion Script for Positions
-- Insert data into position table for firmaDB

USE firmaDB;
GO

-- Set IDENTITY_INSERT ON for position
SET IDENTITY_INSERT position ON;
GO

-- Insert sample positions data (first 50 records as examples)
INSERT INTO position (positionId, [text], price, unit) VALUES
(1, 'XXX', 20, 'Pauschal'),
(2, 'Randleiste', 2.4, 'lfm'),
(3, 'Magerbeton (7m³) ', 805, 'Pauschal'),
(4, 'Rasensamen', 22, 'Stück'),
(5, 'Humus gesiebt', 32, 'm³'),
(6, 'Kies 16-22 (32) gewaschen', 11, 'Tonnen'),
(7, 'Kramerlader ', 210, 'Tage'),
(8, 'Anhänger (für Kramerlader)', 90, 'Pauschal'),
(9, 'Rasenwalze', 40, 'Tage'),
(10, 'Kettenbagger 4,5t', 240, 'Tage'),
(15, 'Frostkoffer 16/32 Körnung 115m³', 7.5, 'Tonnen'),
(16, 'Kies 32-70 RS gewaschen 20m³', 6.9, 'Tonnen'),
(17, 'Kies 16-22 3m³', 9.2, 'Tonnen'),
(18, 'Kabelsand ', 10.4, 'Tonnen'),
(19, 'Baggerstunden 10t', 77, 'Stunden'),
(20, 'Baggerstunden 4.5t', 62, 'Stunden'),
(21, 'Anfahrt /Abfahrt ', 400, 'Pauschal'),
(22, 'LKW Fuhre ', 85, 'Stunde'),
(23, 'Traktor ', 75, 'Stunden'),
(24, 'stunden', 3, 'm³'),
(25, 'Baggerarbeit (Griffen Fernwärme)', 27, 'Stunden'),
(27, 'Baggerstunden 5t mit Mann ', 62, 'Stunden'),
(30, 'Arbeiter ', 30, 'Stunden'),
(35, 'Baggerarbeiten', 35, 'Stunden'),
(50, 'Baggerarbeiten', 31, 'Stunden'),
(60, 'Diverse Arbeiten', 40, 'Stunden'),
(71, 'AQ 60 ', 120.83, 'Stück'),
(72, 'Betonrippenstahl 0.8mm', 4.58, 'Stück'),
(73, 'Unterlegsleisten ', 1.5, 'Stück'),
(74, 'Bügel', 1, 'Stück'),
(75, 'Beton ', 86, 'm³'),
(76, 'Beton Nebenkosten laut Lieferant', 100, 'Pauschal'),
(77, 'Pumpe 2-3mal je nach Bedarf', 140, 'Stück'),
(85, 'Bogen PVC je nach Bedarf 4-5 Stk', 9, 'Stück'),
(86, 'Kleinmaterial/Werkzeug', 70, 'Pauschal'),
(100, 'Baggerarbeiten', 35, 'Stunden'),
(101, 'Baggerarbeiten', 35, 'Stunden'),
(102, 'Teich Ausheben und Tujen entsorgen ', 3300, 'Pauschal'),
(127, 'Baggerstunden 5t mit Mann ', 62, 'Stunden'),
(128, 'Arbeiter ', 30, 'Stunden'),
(135, 'Gesamte Baggerarbeiten /Arbeitsleistung An/Abfahrt lt Besichtigung und Besprechung am 7.5. Mai 2023', 13365, 'Pauschal'),
(136, 'Baggerstunden 5t mit Mann ', 62, 'Stunden'),
(158, 'Baggerarbeiten  TB 250 ', 60, 'Stunden'),
(165, 'Lader ', 173.34, 'Tage'),
(170, 'Baggerarbeiten Mobil 320 RN: INSB A1 Wangauer Ache', 35, 'Stunden'),
(186, 'Baggerarbeiten Mobil 320  RN:INSB A1 Wangauer Ache', 35, 'Stunden'),
(200, 'RN: ISNB A1 Wangauer Ache / Mobilbaggerarbeiten 320', 35, 'Stunden');
GO

SET IDENTITY_INSERT position OFF;
GO
