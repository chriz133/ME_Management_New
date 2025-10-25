# MySQL Database Setup Guide

This guide explains how to connect the ASP.NET Core 8 backend to your MySQL database.

**IMPORTANT:** The backend now **only supports MySQL**. SQLite and SQL Server support has been removed.

## Prerequisites

1. MySQL Server 5.7+ or MariaDB 10.2+
2. MySQL credentials (username and password)
3. Database name (default: `memanagement`)

## Quick Start

### Step 1: Update Connection String

Edit `server/Server.Api/appsettings.json` and update the connection string:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=3306;Database=memanagement;User=root;Password=your_secure_password;AllowPublicKeyRetrieval=True"
  }
}
```

Replace:
- `localhost` with your MySQL server address (e.g., `192.168.0.88`)
- `3306` with your MySQL port (if different)
- `memanagement` with your actual database name
- `root` with your MySQL username
- `your_secure_password` with your actual MySQL password

### Step 2: Ensure Database Exists

Connect to MySQL and create the database if it doesn't exist:

```sql
CREATE DATABASE IF NOT EXISTS memanagement CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Step 3: Run the Backend

```bash
cd server/Server.Api
dotnet run
```

The application will:
- Connect to your MySQL database
- Create necessary tables if they don't exist (using `EnsureCreated()`)
- Seed a default admin user (username: `admin`, password: `admin`)

## Database Schema

### User Table

The application will automatically create a `Users` table if it doesn't exist:

```sql
CREATE TABLE Users (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(100) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    DisplayName VARCHAR(200),
    Email VARCHAR(200),
    CreatedAt DATETIME(6) NOT NULL,
    LastLoginAt DATETIME(6) NULL,
    INDEX IX_Users_Username (Username)
);
```

### Existing Tables

The backend supports both new entities and existing firmaDB schema tables:

**New Entities:**
- Users
- Customers
- Positions
- Contracts
- ContractPositions
- Invoices
- InvoiceLineItems
- Offers
- OfferLineItems

**Existing firmaDB Tables (mapped):**
- address
- customer
- person
- position
- contract
- invoice
- invoice_position
- finance

## Working with Existing Data

The backend uses Entity Framework Core with the following approach:

1. **No Migrations**: The migrations folder has been removed since we're working with an existing database
2. **EnsureCreated()**: On startup, the application checks if tables exist and creates missing ones
3. **No Data Modification**: Existing tables and data are not modified by the backend

### If Your Schema Differs

If your existing MySQL schema uses different table or column names, you may need to:

1. Update the entity configurations in `ApplicationDbContext.cs`
2. Add custom table/column mappings using `ToTable()` and `HasColumnName()`

Example:
```csharp
modelBuilder.Entity<Customer>(entity =>
{
    entity.ToTable("customers"); // Map to lowercase table name
    entity.Property(e => e.Name).HasColumnName("customer_name");
});
```

## Troubleshooting

### Connection Refused
- Check that MySQL server is running: `systemctl status mysql` (Linux) or Task Manager (Windows)
- Verify the IP address and port
- Check firewall rules: `sudo ufw allow 3306` (Linux)

### Authentication Failed
- Verify username and password
- Check user permissions:
  ```sql
  GRANT ALL PRIVILEGES ON memanagement.* TO 'user'@'%';
  FLUSH PRIVILEGES;
  ```

### Table Creation Failed
- Ensure the user has CREATE TABLE privileges
- Check database exists: `SHOW DATABASES;`
- Verify connection string format

### Version Compatibility
- Ensure you're using MySQL 5.7+ or MariaDB 10.2+
- The backend uses Pomelo.EntityFrameworkCore.MySql 8.0.2

## Default Admin User

On first run, the application creates a default admin user:
- **Username**: `admin`
- **Password**: `admin`

**IMPORTANT**: Change this password in production!

## Configuration Options

Additional connection string parameters:

```
Server=localhost;Port=3306;Database=memanagement;User=root;Password=your_secure_password;AllowPublicKeyRetrieval=True;SSL Mode=None;ConnectionTimeout=30
```

- `AllowPublicKeyRetrieval=True`: Required for some MySQL configurations
- `SSL Mode=None`: Disable SSL (use `Required` for production)
- `ConnectionTimeout=30`: Connection timeout in seconds

## Production Considerations

1. **Use SSL**: Set `SSL Mode=Required` in connection string
2. **Strong Passwords**: Change default admin password
3. **Dedicated User**: Create a dedicated MySQL user with minimal privileges
4. **Regular Backups**: Set up automated MySQL backups
5. **Connection Pooling**: Entity Framework handles this automatically

## Need Help?

If you encounter issues:
1. Check the backend console output for error messages
2. Verify MySQL logs: `/var/log/mysql/error.log` (Linux)
3. Test connection with MySQL client: `mysql -h hostname -u username -p`

## Changes from Previous Version

- **Removed**: SQLite support
- **Removed**: SQL Server support
- **Removed**: Entity Framework migrations
- **Changed**: Now uses `EnsureCreated()` instead of `Migrate()`
- **Changed**: Connection string detection logic removed
- **Simplified**: Single database provider (MySQL only)
