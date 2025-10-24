# MySQL Database Migration Guide

This guide explains how to connect the new ASP.NET Core 8 backend to your existing MySQL database from the old Spring Boot application.

## Prerequisites

1. Access to the existing MySQL database at `192.168.0.88`
2. MySQL credentials (username and password)
3. Database name (typically `memanagement` or similar)

## Step 1: Update Connection String

Edit `server/Server.Api/appsettings.json` and update the connection string:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=192.168.0.88;Port=3306;Database=YOUR_DATABASE_NAME;User=YOUR_USERNAME;Password=YOUR_PASSWORD;AllowPublicKeyRetrieval=True;SSL Mode=None"
  }
}
```

Replace:
- `YOUR_DATABASE_NAME` with the actual database name
- `YOUR_USERNAME` with your MySQL username
- `YOUR_PASSWORD` with your MySQL password

## Step 2: Understanding the Schema Mapping

The new backend expects the following database structure. Please provide your existing schema so we can map it correctly:

### Expected Tables

#### Users Table
```sql
CREATE TABLE Users (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(100) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    DisplayName VARCHAR(100),
    Email VARCHAR(255),
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Customers Table
```sql
CREATE TABLE Customers (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Email VARCHAR(255),
    Phone VARCHAR(50),
    Address VARCHAR(500),
    City VARCHAR(100),
    PostalCode VARCHAR(20),
    Country VARCHAR(100) DEFAULT 'Deutschland',
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Invoices Table
```sql
CREATE TABLE Invoices (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    InvoiceNumber VARCHAR(50) NOT NULL UNIQUE,
    CustomerId INT NOT NULL,
    InvoiceDate DATE NOT NULL,
    DueDate DATE,
    Status VARCHAR(50) DEFAULT 'Offen',
    TotalNet DECIMAL(19, 2) DEFAULT 0,
    TotalGross DECIMAL(19, 2) DEFAULT 0,
    Notes TEXT,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (CustomerId) REFERENCES Customers(Id)
);
```

#### InvoiceLineItems Table
```sql
CREATE TABLE InvoiceLineItems (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    InvoiceId INT NOT NULL,
    Position INT NOT NULL,
    Description VARCHAR(500) NOT NULL,
    Quantity DECIMAL(19, 2) NOT NULL,
    Unit VARCHAR(50) DEFAULT 'Stück',
    UnitPrice DECIMAL(19, 2) NOT NULL,
    TaxRate DECIMAL(5, 2) DEFAULT 19.00,
    LineTotal DECIMAL(19, 2),
    FOREIGN KEY (InvoiceId) REFERENCES Invoices(Id) ON DELETE CASCADE
);
```

#### Offers Table
```sql
CREATE TABLE Offers (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    OfferNumber VARCHAR(50) NOT NULL UNIQUE,
    CustomerId INT NOT NULL,
    OfferDate DATE NOT NULL,
    ValidUntil DATE,
    Status VARCHAR(50) DEFAULT 'Entwurf',
    TotalNet DECIMAL(19, 2) DEFAULT 0,
    TotalGross DECIMAL(19, 2) DEFAULT 0,
    Notes TEXT,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (CustomerId) REFERENCES Customers(Id)
);
```

#### OfferLineItems Table
```sql
CREATE TABLE OfferLineItems (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    OfferId INT NOT NULL,
    Position INT NOT NULL,
    Description VARCHAR(500) NOT NULL,
    Quantity DECIMAL(19, 2) NOT NULL,
    Unit VARCHAR(50) DEFAULT 'Stück',
    UnitPrice DECIMAL(19, 2) NOT NULL,
    TaxRate DECIMAL(5, 2) DEFAULT 19.00,
    LineTotal DECIMAL(19, 2),
    FOREIGN KEY (OfferId) REFERENCES Offers(Id) ON DELETE CASCADE
);
```

## Step 3: Schema Mapping

### If Your Schema Differs

If your existing MySQL schema uses different table or column names, we need to update the Entity Framework Core entity configurations. Please provide:

1. Output of `SHOW TABLES;` from your database
2. For each relevant table, output of `DESCRIBE table_name;`
3. Any foreign key relationships: `SELECT * FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = 'your_database_name';`

### Common Differences to Check

- **Table Names**: Are they singular (Customer) or plural (Customers)?
- **Column Names**: Do you use snake_case (customer_name) or PascalCase (CustomerName)?
- **Primary Keys**: Are they named `Id`, `id`, or something else?
- **Foreign Keys**: What naming convention is used?
- **Date Fields**: Are they DATE, DATETIME, or TIMESTAMP?
- **Decimal Fields**: What precision is used for monetary values?

## Step 4: Update Entity Configurations

Once we know your schema, we'll update the Entity Framework Core configurations in:
- `server/Server.DataAccess/Configurations/` (if needed)
- Or use Data Annotations on the entities in `server/Server.BusinessObjects/`

Example configuration for custom table/column names:

```csharp
public class CustomerConfiguration : IEntityTypeConfiguration<Customer>
{
    public void Configure(EntityTypeBuilder<Customer> builder)
    {
        builder.ToTable("customers"); // Lowercase table name
        builder.HasKey(c => c.Id);
        builder.Property(c => c.Name).HasColumnName("customer_name"); // Custom column name
        // ... more mappings
    }
}
```

## Step 5: Run Migrations (If Needed)

If your database schema matches our structure, run:

```bash
cd server/Server.Api
dotnet ef database update
```

If not, we'll need to either:
1. Create a migration that matches your existing schema, OR
2. Create scripts to transform your data to our schema

## Step 6: Test Connection

Start the backend:

```bash
cd server/Server.Api
dotnet run
```

The application should connect to your MySQL database and display existing data in the frontend.

## Step 7: Verify Data in Frontend

1. Start the frontend: `cd client && npm start`
2. Navigate to http://localhost:4200
3. Login with your credentials
4. Check:
   - Customers page shows existing customers
   - Invoices page shows existing invoices
   - Offers page shows existing offers

## Troubleshooting

### Connection Refused
- Check that MySQL server is running
- Verify the IP address and port
- Check firewall rules

### Authentication Failed
- Verify username and password
- Check user permissions: `GRANT ALL PRIVILEGES ON database_name.* TO 'user'@'%';`

### Table Not Found
- Verify database name is correct
- Check that tables exist: `SHOW TABLES;`
- Verify user has permissions: `SHOW GRANTS FOR 'user'@'%';`

### Data Type Mismatch
- Compare our expected schema with your existing schema
- We may need to update entity configurations

## Need Help?

Please provide:
1. The output of `SHOW CREATE TABLE customers;` (or whatever your customers table is named)
2. The output of `SHOW CREATE TABLE` for other relevant tables
3. Any error messages from the backend logs

This will help us map your existing schema to the new backend structure.
