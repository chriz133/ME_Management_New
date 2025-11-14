# MySQL Development Server - Quick Start

This project includes a Docker-based local MySQL server setup for development purposes, useful when the normal MySQL database is not reachable.

## Quick Start (Linux/macOS)

```bash
# Start the server
./mysql-dev.sh start

# Check status
./mysql-dev.sh status

# View logs
./mysql-dev.sh logs

# Connect to database
./mysql-dev.sh connect
```

## Quick Start (Windows)

```cmd
REM Start the server
mysql-dev.bat start

REM Check status
mysql-dev.bat status

REM View logs
mysql-dev.bat logs

REM Connect to database
mysql-dev.bat connect
```

## Connection Details

- **Server**: localhost:3306
- **Database**: firmaDB
- **Username**: devuser
- **Password**: devpassword
- **Root Password**: rootpassword
- **Connection String**: `Server=localhost;Port=3306;Database=firmaDB;User=devuser;Password=devpassword;AllowPublicKeyRetrieval=True`

## What's Included

The MySQL database will be automatically initialized with the data from `server/Server.DataAccess/dump/dump.sql`:

- ✅ All 8 database tables
- ✅ 33 customer records
- ✅ 50+ service/position records  
- ✅ 18 contracts with line items
- ✅ 30+ invoices with line items
- ✅ 48 transaction records

## System Requirements

- Docker Desktop installed and running
- 2GB free disk space
- Port 3306 available

## Common Commands

| Task | Linux/macOS | Windows |
|------|-------------|---------|
| Start server | `./mysql-dev.sh start` | `mysql-dev.bat start` |
| Stop server | `./mysql-dev.sh stop` | `mysql-dev.bat stop` |
| Check status | `./mysql-dev.sh status` | `mysql-dev.bat status` |
| View logs | `./mysql-dev.sh logs` | `mysql-dev.bat logs` |
| Connect to DB | `./mysql-dev.sh connect` | `mysql-dev.bat connect` |
| Reset (delete all) | `./mysql-dev.sh reset` | `mysql-dev.bat reset` |

## Using in Application

Update your `appsettings.json` or `appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=3306;Database=firmaDB;User=devuser;Password=devpassword;AllowPublicKeyRetrieval=True"
  }
}
```

## Troubleshooting

**Server won't start?**
- Ensure Docker Desktop is running
- Check if port 3306 is available
- Run `./mysql-dev.sh logs` (or `.bat` on Windows) to see errors

**Can't connect?**
- Wait 1-2 minutes after starting (initialization takes time)
- Check status with `./mysql-dev.sh status`
- Verify firewall settings

**Need to start fresh?**
- Run `./mysql-dev.sh reset` to delete all data and reinitialize

## Data Persistence

- Database data is stored in a Docker volume named `mysql-data`
- Data persists even when the container is stopped or removed
- Data is only deleted when you explicitly remove the volume with the `reset` command

## Stopping the Server

The server will continue running in the background until you stop it:

```bash
# Stop the server
./mysql-dev.sh stop

# Or completely remove it (keeps data)
docker compose -f docker-compose.dev.yml down

# Or remove it and delete all data
./mysql-dev.sh reset
```
