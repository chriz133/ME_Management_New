# MSSQL Database Setup for Development

This guide explains how to set up a local MSSQL Server for development using Docker, with the same tables and data as the MySQL production database.

## Overview

This setup provides a local MSSQL Server 2022 instance running in Docker with:
- All database tables from the `firmaDB` MySQL dump
- Sample data pre-loaded for development
- Persistent data storage
- Easy start/stop commands

## Prerequisites

- Docker Desktop installed and running
- Docker Compose (included with Docker Desktop)
- At least 2GB of free disk space
- Port 1433 available (default MSSQL port)

## Quick Start

### 1. Start the MSSQL Server

From the project root directory, run:

```bash
docker-compose -f docker-compose.dev.yml up -d
```

This will:
- Download the MSSQL Server 2022 Docker image (if not already downloaded)
- Create and start the container
- Initialize the database with tables and sample data
- The process takes about 1-2 minutes on first run

### 2. Verify the Server is Running

Check the container status:

```bash
docker-compose -f docker-compose.dev.yml ps
```

You should see the `memanagement-mssql-dev` container running and healthy.

### 3. View Initialization Logs

To see the database initialization progress:

```bash
docker-compose -f docker-compose.dev.yml logs -f mssql
```

Press `Ctrl+C` to exit the logs view.

## Connection Details

Once the server is running, you can connect using these credentials:

- **Server**: `localhost` (or `127.0.0.1`)
- **Port**: `1433`
- **Database**: `firmaDB`
- **Username**: `sa`
- **Password**: `YourStrong!Passw0rd`

### Connection String Examples

**For .NET/C# (ASP.NET Core):**
```
Server=localhost,1433;Database=firmaDB;User Id=sa;Password=YourStrong!Passw0rd;TrustServerCertificate=True;
```

**For SQL Server Management Studio (SSMS):**
- Server name: `localhost,1433`
- Authentication: SQL Server Authentication
- Login: `sa`
- Password: `YourStrong!Passw0rd`

**For Azure Data Studio:**
- Connection type: Microsoft SQL Server
- Server: `localhost,1433`
- Authentication type: SQL Login
- User name: `sa`
- Password: `YourStrong!Passw0rd`

## Database Schema

The MSSQL database includes the following tables (matching the MySQL schema):

### Core Tables
- **customer2** - Customer information (33 sample records)
- **position** - Service/product positions (50+ sample records)
- **contract** - Customer contracts (18 sample records)
- **contract_position** - Line items for contracts
- **invoice** - Customer invoices (30+ sample records)
- **invoice_position** - Line items for invoices
- **transaction** - Financial transactions (48 sample records)
- **address** - Address information

### Key Differences from MySQL

The MSSQL schema has been adapted from MySQL with these changes:

1. **AUTO_INCREMENT → IDENTITY**: Auto-increment columns use `IDENTITY(1,1)` instead of `AUTO_INCREMENT`
2. **TINYINT → TINYINT**: Boolean fields remain as `TINYINT` (0 or 1)
3. **VARCHAR → VARCHAR**: Text fields are the same
4. **DOUBLE → FLOAT**: Decimal numbers use `FLOAT` instead of `DOUBLE`
5. **Reserved Keywords**: `transaction` and `type` are escaped with brackets `[transaction]` and `[type]`
6. **SET → VARCHAR**: The `medium` field in transaction uses `CHECK` constraint instead of MySQL's `SET`

## Managing the Container

### Stop the Server
```bash
docker-compose -f docker-compose.dev.yml stop
```

### Start the Server (after stopping)
```bash
docker-compose -f docker-compose.dev.yml start
```

### Restart the Server
```bash
docker-compose -f docker-compose.dev.yml restart
```

### Remove the Server (keeps data)
```bash
docker-compose -f docker-compose.dev.yml down
```

### Remove the Server and Data (complete reset)
```bash
docker-compose -f docker-compose.dev.yml down -v
```

**Warning**: Using `-v` will delete all database data. You'll need to restart the container to reinitialize.

## Data Persistence

Database data is stored in a Docker volume named `mssql-data`. This means:
- Data persists even when the container is stopped or removed
- Data is only deleted when you explicitly remove the volume with `-v`
- You can backup/restore this volume using Docker commands

### Backup the Database

Using sqlcmd from within the container:
```bash
docker exec -it memanagement-mssql-dev /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P 'YourStrong!Passw0rd' -Q "BACKUP DATABASE firmaDB TO DISK = '/var/opt/mssql/backup/firmaDB.bak'"
```

## Troubleshooting

### Container Won't Start

1. **Check if port 1433 is already in use:**
   ```bash
   # On Windows
   netstat -ano | findstr :1433
   
   # On macOS/Linux
   lsof -i :1433
   ```

2. **Check Docker logs:**
   ```bash
   docker-compose -f docker-compose.dev.yml logs mssql
   ```

3. **Ensure Docker has enough resources:**
   - Go to Docker Desktop Settings → Resources
   - Allocate at least 2GB of memory

### Cannot Connect to Database

1. **Verify the container is healthy:**
   ```bash
   docker-compose -f docker-compose.dev.yml ps
   ```
   
2. **Test connection from command line:**
   ```bash
   docker exec -it memanagement-mssql-dev /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P 'YourStrong!Passw0rd'
   ```

3. **Check firewall settings** - Ensure port 1433 is not blocked

### Database Not Initialized

If tables are missing:

1. **Check initialization logs:**
   ```bash
   docker-compose -f docker-compose.dev.yml logs mssql | grep -i "executing\|error"
   ```

2. **Manually run initialization scripts:**
   ```bash
   docker exec -it memanagement-mssql-dev /bin/bash
   cd /docker-entrypoint-initdb.d
   for f in *.sql; do /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$SA_PASSWORD" -i "$f"; done
   exit
   ```

## Customization

### Change the SA Password

Edit `docker-compose.dev.yml` and change the `SA_PASSWORD` environment variable and all references to it.

**Important**: Use a strong password in production!

### Change the Port

If port 1433 is already in use, edit `docker-compose.dev.yml`:

```yaml
ports:
  - "1434:1433"  # Use port 1434 on your host
```

Then connect using `localhost,1434` instead.

### Add More Data

To add more sample data:

1. Create a new SQL file in `server/Server.DataAccess/dump/mssql/`
2. Name it with a number prefix (e.g., `07-insert-more-data.sql`)
3. The scripts are executed in alphabetical order
4. Restart the container to apply changes (or run the script manually)

## Production Considerations

**DO NOT use this setup for production!**

For production:
- Use Azure SQL Database or a properly managed SQL Server instance
- Change the SA password to something strong and secure
- Enable SSL/TLS encryption
- Configure proper backup strategies
- Set up monitoring and alerts
- Use least-privilege accounts (don't use SA)

## Comparing with MySQL

This MSSQL setup mirrors the MySQL database structure. Here are the main differences:

| Feature | MySQL | MSSQL |
|---------|-------|-------|
| Auto Increment | AUTO_INCREMENT | IDENTITY(1,1) |
| Boolean | TINYINT(1) | BIT or TINYINT |
| Strings | VARCHAR with utf8mb4 | VARCHAR with default collation |
| Decimals | DOUBLE | FLOAT |
| Reserved Words | Backticks \`table\` | Brackets [table] |
| Engine | InnoDB | Not applicable |

## Additional Resources

- [SQL Server on Docker Documentation](https://learn.microsoft.com/en-us/sql/linux/quickstart-install-connect-docker)
- [MSSQL Tools](https://learn.microsoft.com/en-us/sql/tools/overview-sql-tools)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

## Support

For issues with:
- **Docker setup**: Check Docker Desktop logs and ensure it's running
- **Database schema**: Refer to the MySQL dump in `server/Server.DataAccess/dump/dump.sql`
- **Connection issues**: Verify credentials and network settings

## Next Steps

After setting up the MSSQL server:

1. Update your application's connection string to point to this MSSQL instance
2. Test your application against MSSQL to ensure compatibility
3. Run any migrations or schema updates as needed
4. Consider creating integration tests against this dev database
