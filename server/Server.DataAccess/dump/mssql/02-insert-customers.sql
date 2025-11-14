-- MSSQL Data Insertion Script
-- Insert data into tables for firmaDB

USE firmaDB;
GO

-- Set IDENTITY_INSERT ON for customer2
SET IDENTITY_INSERT customer2 ON;
GO

-- Insert data into customer2
INSERT INTO customer2 (customerId, firstname, surname, plz, city, address, nr, uid) VALUES
(1, 'Eva', 'Muhr', 9125, 'Kühnsdorf ', 'Waldebene', 42, NULL),
(2, 'Adelina und Martin', 'Lippitz', 9433, 'St.Andrä', 'Burgstall-St.Andrä', 79, NULL),
(3, 'Franz', 'Pruntsch GmbH', 9113, 'Ruden', 'Obermitterdorf', 7, 'ATU69904213'),
(4, 'Christian', 'Komar', 9125, 'Kühnsdorf', 'St.Marxen', 62, NULL),
(5, 'Christian', 'Berchthold', 9155, 'Neuhaus', 'Oberndorf', 6, NULL),
(6, 'Firma', 'Alois Markolin GmbH', 9064, 'Krobathen', 'Görtschitztal Bundesstr.', 1, 'ATU 64448627'),
(7, 'Firma', 'Matschek Glas-Metall GmbH', 9150, 'Bleiburg', 'Schilterndorf', 7, 'ATU63671413'),
(8, 'Pier Leone', 'Parisi', 31050, 'Villorba/Trevisio', 'Via Pastro ', 48, NULL),
(9, 'Felix ', 'Scheriau', 9133, 'Sittersdorf', 'Sagerberg', 19, '532401 Betriebsnummer'),
(10, 'Sabine ', 'Karnitschar', 9133, 'Sitterdorf', 'Sonnegg', 5, NULL),
(11, 'Frederika', 'Aiello', 9122, 'St. Kanzian', 'Gottaweg', 2, NULL),
(12, 'Melanie', 'Pantner', 9150, 'Bleiburg', 'Ebersdorf ', 67, NULL),
(13, 'Harald', 'Kanzian', 9135, 'Eisenkappel', 'Unterort ', 10, NULL),
(14, 'Hermann ', 'Melchior', 9150, 'Bleiburg', 'Schilterndorf', 29, NULL),
(15, 'Roland', 'Micelli', 9150, 'Bleiburg', 'Postgasse', 3, NULL),
(16, 'Biowärme', ' Bleiburg GmbH', 9150, 'Bleiburg', 'Gewerbezone ', 6, NULL),
(17, 'Firma', 'MASSIVBAU-GesmbH', 9065, 'Ebenthal in Kärnten', 'Zeiss Straße ', 3, 'ATU25453407'),
(18, 'Bettina', 'Bojer', 9463, 'Reichenfels', 'Weitenbach', 6, ''),
(19, 'Bettina', 'Bojer', 9463, 'Reichenfels', 'Weitenbach', 6, NULL),
(20, 'Harald', 'Schein', 9142, 'GLOBASNITZ', 'Jaunstein ', 54, NULL),
(21, 'Witold ', 'Szymanski', 9112, 'Griffen', 'Erlachstrasse', 60, NULL),
(22, 'Robert', 'Maitan', 9125, 'Kühnsdorf', 'Mittlern', 1, NULL),
(23, 'Stefan', 'Chalupa', 9210, 'Pörtschach am Wörthersee', 'Spathwiesenweg', 2, NULL),
(24, 'Petzen ', 'Bergbahnen GmbH', 9143, 'St.Michael ', 'Unterort ', 52, 'ATU47182604'),
(25, 'Bernhard', 'Boschitz', 9125, 'Kühnsdorf', 'Nord ', 26, NULL),
(26, 'Werner', 'Drießler', 9102, 'Völkermarkt', 'Gattersdorf', 22, NULL),
(27, 'Anton ', 'Prikerschnik', 9125, 'Kühnsdorf', 'Lerchenfeld ', 12, NULL),
(28, 'Birgit ', 'Samitz', 9141, 'EBERNDORF', 'Buchhalm', 15, NULL),
(29, 'Firma', 'taktbau GmbH', 9065, 'Ebenthal in Kärnten', 'Zeiss-Straße', 3, 'ATU72550134'),
(30, 'Wolfgang', 'Wallner', 9125, 'Kühnsdorf', 'St. Marxen ', 94, NULL),
(31, 'Firma', 'Jauntaler Kies - GesmbH', 9125, 'EBERNDORF', 'Pribelsdorf', 81, 'ATU 57379919'),
(32, 'Firma', 'CHECK Handels GmbH', 9130, 'Poggersdorf', 'Marktstraße ', 8, 'ATU68219144'),
(33, 'Firma', 'Kostmann GesmbH', 9433, 'St.Andrä', 'Burgstall', 44, 'ATU 60838302');
GO

SET IDENTITY_INSERT customer2 OFF;
GO
