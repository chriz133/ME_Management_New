# Local MSSQL Development Server - Quick Reference

This project includes a Docker-based local MSSQL Server setup for development purposes.

## Quick Start (Linux/macOS)

```bash
# Start the server
./mssql-dev.sh start

# Check status
./mssql-dev.sh status

# View logs
./mssql-dev.sh logs

# Connect to database
./mssql-dev.sh connect
```

## Quick Start (Windows)

```cmd
REM Start the server
mssql-dev.bat start

REM Check status
mssql-dev.bat status

REM View logs
mssql-dev.bat logs

REM Connect to database
mssql-dev.bat connect
```

## Connection Details

- **Server**: localhost,1433
- **Database**: firmaDB
- **Username**: sa
- **Password**: YourStrong!Passw0rd
- **Connection String**: `Server=localhost,1433;Database=firmaDB;User Id=sa;Password=YourStrong!Passw0rd;TrustServerCertificate=True;`

## What's Included

The MSSQL database contains the same schema and sample data as the MySQL production database:

- ✅ All 8 database tables
- ✅ 33 customer records
- ✅ 50+ service/position records  
- ✅ 18 contracts with line items
- ✅ 30+ invoices with line items
- ✅ 48 transaction records

## Full Documentation

For detailed setup, troubleshooting, and advanced usage, see:
- [MSSQL_DEV_SETUP.md](./MSSQL_DEV_SETUP.md) - Complete setup guide

## System Requirements

- Docker Desktop installed and running
- 2GB free disk space
- Port 1433 available

## Common Commands

| Task | Linux/macOS | Windows |
|------|-------------|---------|
| Start server | `./mssql-dev.sh start` | `mssql-dev.bat start` |
| Stop server | `./mssql-dev.sh stop` | `mssql-dev.bat stop` |
| Check status | `./mssql-dev.sh status` | `mssql-dev.bat status` |
| View logs | `./mssql-dev.sh logs` | `mssql-dev.bat logs` |
| Connect to DB | `./mssql-dev.sh connect` | `mssql-dev.bat connect` |
| Reset (delete all) | `./mssql-dev.sh reset` | `mssql-dev.bat reset` |

## Troubleshooting

**Server won't start?**
- Ensure Docker Desktop is running
- Check if port 1433 is available
- Run `./mssql-dev.sh logs` (or `.bat` on Windows) to see errors

**Can't connect?**
- Wait 1-2 minutes after starting (initialization takes time)
- Check status with `./mssql-dev.sh status`
- Verify firewall settings

**Need to start fresh?**
- Run `./mssql-dev.sh reset` to delete all data and reinitialize
