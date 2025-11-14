# MSSQL Development Server - Testing Guide

This guide helps verify that the MSSQL development server is working correctly.

## Pre-flight Checklist

Before testing, ensure you have:
- ✅ Docker Desktop installed and running
- ✅ Port 1433 available (not used by another service)
- ✅ At least 2GB free disk space

## Step-by-Step Testing

### 1. Start the Server

**Linux/macOS:**
```bash
./mssql-dev.sh start
```

**Windows:**
```cmd
mssql-dev.bat start
```

**Expected Output:**
```
Starting MSSQL development server...
[+] Running 2/2
 ✔ Network me_management_new_memanagement-network  Created
 ✔ Container memanagement-mssql-dev                 Started

Server is starting. This may take a minute...
Connection details:
  Server: localhost,1433
  Database: firmaDB
  Username: sa
  Password: YourStrong!Passw0rd
```

### 2. Check Server Status

**Linux/macOS:**
```bash
./mssql-dev.sh status
```

**Windows:**
```cmd
mssql-dev.bat status
```

**Expected Output:**
```
MSSQL Development Server Status:
================================
NAME                        IMAGE                                        ...  STATUS
memanagement-mssql-dev      mcr.microsoft.com/mssql/server:2022-latest   ...  Up 2 minutes (healthy)

✓ Server is running
✓ Server is healthy and ready
```

### 3. View Initialization Logs

**Linux/macOS:**
```bash
./mssql-dev.sh logs
```

**Windows:**
```cmd
mssql-dev.bat logs
```

**Look for these messages:**
```
Waiting for SQL Server to start...
Executing /docker-entrypoint-initdb.d/01-init-database.sql...
Executing /docker-entrypoint-initdb.d/02-insert-customers.sql...
Executing /docker-entrypoint-initdb.d/03-insert-positions.sql...
Executing /docker-entrypoint-initdb.d/04-insert-contracts.sql...
Executing /docker-entrypoint-initdb.d/05-insert-invoices.sql...
Executing /docker-entrypoint-initdb.d/06-insert-transactions.sql...
Database initialization complete!
```

### 4. Connect and Query the Database

**Option A: Using the Helper Script**

**Linux/macOS:**
```bash
./mssql-dev.sh connect
```

**Windows:**
```cmd
mssql-dev.bat connect
```

**Option B: Using Docker Directly**

```bash
docker exec -it memanagement-mssql-dev /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P 'YourStrong!Passw0rd' -d firmaDB
```

**Test Queries:**

Once connected (you'll see a `1>` prompt), run these queries:

```sql
-- Check all tables exist
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE';
GO

-- Count customers
SELECT COUNT(*) AS CustomerCount FROM customer2;
GO

-- Count positions
SELECT COUNT(*) AS PositionCount FROM position;
GO

-- Count contracts
SELECT COUNT(*) AS ContractCount FROM contract;
GO

-- Count invoices
SELECT COUNT(*) AS InvoiceCount FROM invoice;
GO

-- Count transactions
SELECT COUNT(*) AS TransactionCount FROM [transaction];
GO

-- View sample customer data
SELECT TOP 5 customerId, firstname, surname, city FROM customer2;
GO

-- Exit
exit
```

**Expected Results:**
- Tables: 8 tables (address, contract, contract_position, customer2, invoice, invoice_position, position, transaction)
- CustomerCount: 33
- PositionCount: 50+
- ContractCount: 18
- InvoiceCount: 30+
- TransactionCount: 48

### 5. Test with SQL Client Tools

**SQL Server Management Studio (SSMS):**
1. Open SSMS
2. Server name: `localhost,1433`
3. Authentication: SQL Server Authentication
4. Login: `sa`
5. Password: `YourStrong!Passw0rd`
6. Click Connect
7. Expand Databases → firmaDB → Tables

**Azure Data Studio:**
1. Open Azure Data Studio
2. New Connection
3. Server: `localhost,1433`
4. Authentication type: SQL Login
5. User name: `sa`
6. Password: `YourStrong!Passw0rd`
7. Database: `firmaDB`
8. Connect

**DBeaver / Other Tools:**
- Host: localhost
- Port: 1433
- Database: firmaDB
- Username: sa
- Password: YourStrong!Passw0rd

### 6. Test Connection from Application

Update your `appsettings.json` or create a new config file:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;Database=firmaDB;User Id=sa;Password=YourStrong!Passw0rd;TrustServerCertificate=True;"
  }
}
```

**For .NET:**
```csharp
// In your startup/program.cs
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    );
});
```

### 7. Stop the Server

**Linux/macOS:**
```bash
./mssql-dev.sh stop
```

**Windows:**
```cmd
mssql-dev.bat stop
```

**Expected Output:**
```
Stopping MSSQL development server...
[+] Stopping 1/1
 ✔ Container memanagement-mssql-dev  Stopped
Server stopped
```

## Troubleshooting Tests

### Test 1: Port Conflict

If you get a port conflict error:

**Check what's using port 1433:**
```bash
# Linux/macOS
lsof -i :1433

# Windows
netstat -ano | findstr :1433
```

**Solution:** Either stop the conflicting service or change the port in `docker-compose.dev.yml`

### Test 2: Database Not Initialized

If tables are missing:

```bash
# View logs to see what went wrong
./mssql-dev.sh logs

# Manually run initialization
docker exec -it memanagement-mssql-dev /bin/bash
cd /docker-entrypoint-initdb.d
for f in *.sql; do /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$SA_PASSWORD" -i "$f"; done
exit
```

### Test 3: Cannot Connect

```bash
# Check container health
docker inspect memanagement-mssql-dev | grep -A 10 Health

# Check container logs
docker logs memanagement-mssql-dev

# Restart the container
./mssql-dev.sh restart
```

## Performance Tests

### Test Database Query Performance

```sql
-- Test query performance
SET STATISTICS TIME ON;
GO

-- Join query test
SELECT 
    i.invoiceId,
    c.firstname,
    c.surname,
    COUNT(ip.invoicePositionId) as LineItemCount,
    i.created_at
FROM invoice i
INNER JOIN customer2 c ON i.customerId = c.customerId
LEFT JOIN invoice_position ip ON i.invoiceId = ip.invoiceId
GROUP BY i.invoiceId, c.firstname, c.surname, i.created_at
ORDER BY i.created_at DESC;
GO

SET STATISTICS TIME OFF;
GO
```

## Data Validation Tests

### Verify Foreign Key Relationships

```sql
-- Check contract-customer relationship
SELECT 
    contract.contractId,
    customer2.firstname + ' ' + customer2.surname AS CustomerName
FROM contract
INNER JOIN customer2 ON contract.customerId = customer2.customerId;
GO

-- Check invoice-customer relationship
SELECT 
    invoice.invoiceId,
    customer2.firstname + ' ' + customer2.surname AS CustomerName
FROM invoice
INNER JOIN customer2 ON invoice.customerId = customer2.customerId;
GO

-- Check contract positions
SELECT 
    cp.contractPositionId,
    c.contractId,
    p.text AS PositionText,
    cp.amount
FROM contract_position cp
INNER JOIN contract c ON cp.contractId = c.contractId
INNER JOIN position p ON cp.positionId = p.positionId;
GO
```

## Cleanup Test

**Complete reset (removes all data):**

**Linux/macOS:**
```bash
./mssql-dev.sh reset
```

**Windows:**
```cmd
mssql-dev.bat reset
```

This will:
1. Stop the container
2. Remove the container
3. Delete the data volume
4. Start a fresh container
5. Re-initialize the database

## Success Criteria

Your MSSQL development server is working correctly if:

- ✅ Container starts without errors
- ✅ Health check passes (status shows "healthy")
- ✅ All 8 tables are created
- ✅ Sample data is loaded correctly
- ✅ Can connect using SQL clients
- ✅ Queries return expected results
- ✅ Foreign key relationships work
- ✅ Can stop/start/restart without issues

## Next Steps

After successful testing:

1. ✅ Test your application against this MSSQL instance
2. ✅ Run integration tests
3. ✅ Verify all features work correctly
4. ✅ Document any MSSQL-specific issues
5. ✅ Update application connection strings as needed

## Support

If you encounter issues not covered here:
1. Check the full documentation: [MSSQL_DEV_SETUP.md](MSSQL_DEV_SETUP.md)
2. Review troubleshooting section in the docs
3. Check Docker logs: `docker logs memanagement-mssql-dev`
4. Verify Docker Desktop is running and healthy
5. Create an issue with error logs and steps to reproduce
