# MySQL Schema Integration - Waiting for Schema

## Status

⏳ **Waiting for MySQL database schema from existing system**

The backend is ready to connect to MySQL and will auto-detect the database type. However, to properly map the existing database tables to the new Entity Framework Core entities, we need the database schema.

## What We Need

The user has mentioned they have a MySQL dump file (`dump.sql`), but we need access to it. Options:

### Option 1: Upload to Repository (Recommended)
Upload the `dump.sql` file to this repository in a `/docs` or `/schema` folder, then we can:
1. Analyze the CREATE TABLE statements
2. Map columns to Entity Framework entities
3. Configure table/column name mappings
4. Test with real data

### Option 2: Share Schema Information
Provide the output of these SQL commands:

```sql
-- List all tables
SHOW TABLES;

-- For each table, get structure
DESCRIBE customers;
DESCRIBE invoices;
DESCRIBE offers;
DESCRIBE positions;
DESCRIBE contracts;
DESCRIBE transactions;
-- etc for all relevant tables

-- Get foreign key relationships
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM
    information_schema.KEY_COLUMN_USAGE
WHERE
    TABLE_SCHEMA = 'your_database_name'
    AND REFERENCED_TABLE_NAME IS NOT NULL;
```

### Option 3: Direct Connection
Provide MySQL connection details (host, port, database, user, password) so we can connect and inspect the schema directly.

## Current Backend Configuration

The backend already has MySQL support configured:

- **Package**: Pomelo.EntityFrameworkCore.MySql 8.0.2
- **Auto-detection**: Detects database type from connection string
- **Connection String Format**: 
  ```json
  {
    "ConnectionStrings": {
      "DefaultConnection": "Server=192.168.0.88;Port=3306;Database=YOUR_DB;User=YOUR_USER;Password=YOUR_PASSWORD;AllowPublicKeyRetrieval=True"
    }
  }
  ```

## What Will Be Done Once Schema Is Received

1. **Analyze Tables**: Understand the structure of:
   - Customers (Kunden)
   - Invoices (Rechnungen)
   - Offers (Angebote)
   - Positions
   - Contracts (Verträge)
   - Transactions/Finance
   - Users
   - Any other related tables

2. **Update Entity Classes** in `Server.BusinessObjects`:
   - Add properties matching database columns
   - Configure relationships (foreign keys)
   - Add data annotations for validation

3. **Configure Entity Framework** in `Server.DataAccess`:
   - Map table names using `ToTable()` if different from entity names
   - Map column names using `HasColumnName()` if different
   - Configure relationships and foreign keys
   - Set up indexes and constraints

4. **Update Repositories**: Ensure all queries work with the actual schema

5. **Test Connection**: 
   ```bash
   cd server/Server.Api
   # Update appsettings.json with real connection string
   dotnet run
   ```

6. **Verify Frontend**: Test that all data displays correctly in Angular UI

## Example Mapping

If your MySQL table looks like this:
```sql
CREATE TABLE `kunden` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firmenname` varchar(255),
  `ansprechpartner` varchar(255),
  `email` varchar(255),
  `telefon` varchar(50),
  `adresse` text,
  `erstellt_am` datetime,
  PRIMARY KEY (`id`)
);
```

We'll configure Entity Framework like this:
```csharp
public class Customer
{
    public int Id { get; set; }
    public string CompanyName { get; set; }
    public string ContactPerson { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public string Address { get; set; }
    public DateTime CreatedAt { get; set; }
}

// In ApplicationDbContext.cs or configuration
modelBuilder.Entity<Customer>(entity =>
{
    entity.ToTable("kunden");
    entity.Property(e => e.CompanyName).HasColumnName("firmenname");
    entity.Property(e => e.ContactPerson).HasColumnName("ansprechpartner");
    entity.Property(e => e.Email).HasColumnName("email");
    entity.Property(e => e.Phone).HasColumnName("telefon");
    entity.Property(e => e.Address).HasColumnName("adresse");
    entity.Property(e => e.CreatedAt).HasColumnName("erstellt_am");
});
```

## Next Steps

1. ✅ UI contrast improved (WCAG AAA compliant)
2. ✅ MySQL support added to backend
3. ✅ Documentation created
4. ⏳ **Waiting for schema** → Please upload dump.sql or share schema
5. ⏳ Map schema to entities
6. ⏳ Test with real data
7. ⏳ Verify frontend displays all data correctly

## Questions?

If you have any questions about the integration process, please ask!
