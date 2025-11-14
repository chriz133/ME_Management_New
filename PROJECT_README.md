# ME Management System

A comprehensive management system for construction/excavation business operations, including customer management, contracts, invoices, positions, and financial transactions.

## Project Structure

- **Frontend**: React application (port 3000)
- **Backend**: ASP.NET Core 8 API (port 5000)
- **Database**: MySQL (production) / MSSQL (development option)

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- .NET 8 SDK
- Docker Desktop (for local MSSQL development)

### Running the Application

#### Start Frontend
```bash
# Linux/macOS
./start-frontend.sh

# Windows
start-frontend.bat
```

#### Start Backend
```bash
# Linux/macOS
./start-backend.sh

# Windows
start-backend.bat
```

## Database Setup

### MySQL (Production)

See [MYSQL_MIGRATION_GUIDE.md](MYSQL_MIGRATION_GUIDE.md) for complete MySQL setup instructions.

**Quick Connection:**
- Server: 192.168.0.88:3306
- Database: firmaDB
- See `server/Server.Api/appsettings.json` for credentials

### MSSQL (Local Development) - NEW! 🎉

Run a local MSSQL Server 2022 instance in Docker with all sample data.

**Quick Start:**
```bash
# Linux/macOS
./mssql-dev.sh start

# Windows
mssql-dev.bat start
```

**Connection Details:**
- Server: localhost,1433
- Database: firmaDB
- Username: sa
- Password: YourStrong!Passw0rd

**Documentation:**
- [MSSQL_QUICK_START.md](MSSQL_QUICK_START.md) - Quick reference
- [MSSQL_DEV_SETUP.md](MSSQL_DEV_SETUP.md) - Complete setup guide

## Database Schema

The application manages the following entities:

- **customer2**: Customer information (33 records)
- **position**: Service/product positions (50+ records)
- **contract**: Customer contracts (18 records)
- **contract_position**: Contract line items
- **invoice**: Customer invoices (30+ records)
- **invoice_position**: Invoice line items
- **transaction**: Financial transactions (48 records)
- **address**: Address information

## Project Documentation

- [README.md](README.md) - This file
- [MYSQL_MIGRATION_GUIDE.md](MYSQL_MIGRATION_GUIDE.md) - MySQL setup and migration
- [MSSQL_DEV_SETUP.md](MSSQL_DEV_SETUP.md) - Local MSSQL development setup
- [MSSQL_QUICK_START.md](MSSQL_QUICK_START.md) - MSSQL quick reference
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Common issues and solutions
- [README_MODERNIZATION.md](README_MODERNIZATION.md) - Modernization notes
- [SCHEMA_NEEDED.md](SCHEMA_NEEDED.md) - Schema requirements
- [FRONTEND_FIXES.md](FRONTEND_FIXES.md) - Frontend improvements
- [UI_CONTRAST_IMPROVEMENTS.md](UI_CONTRAST_IMPROVEMENTS.md) - UI accessibility
- [VISUAL_IMPROVEMENTS.md](VISUAL_IMPROVEMENTS.md) - Visual enhancements

## Technology Stack

### Frontend
- React 18
- React Router
- Axios for API calls
- CSS3 with custom styling

### Backend
- ASP.NET Core 8
- Entity Framework Core 8
- JWT Authentication
- Pomelo.EntityFrameworkCore.MySql 8.0.2
- RESTful API design

### Database
- **Production**: MySQL 8.0
- **Development**: MSSQL Server 2022 (Docker)

## Development Workflow

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ME_Management_New
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   npm install
   
   # Backend
   cd server/Server.Api
   dotnet restore
   ```

3. **Start local MSSQL (optional)**
   ```bash
   ./mssql-dev.sh start
   ```

4. **Run the application**
   ```bash
   # Frontend (in project root)
   ./start-frontend.sh
   
   # Backend (in another terminal)
   ./start-backend.sh
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Documentation: http://localhost:5000/swagger

## Default Credentials

**Backend Login:**
- Username: `admin`
- Password: `admin`

⚠️ **Change these in production!**

## Contributing

When contributing to this project:
1. Create a feature branch
2. Make your changes
3. Test thoroughly (including both MySQL and MSSQL if applicable)
4. Submit a pull request

## Support

For issues or questions:
1. Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. Check existing documentation
3. Create an issue in the repository

## License

[Add your license here]

---

## Recent Updates

### MSSQL Development Setup (Latest)
- ✅ Added local MSSQL Server 2022 Docker setup
- ✅ Converted MySQL schema to MSSQL
- ✅ Included sample data for all tables
- ✅ Created helper scripts for easy management
- ✅ Comprehensive documentation

### Frontend Improvements
- ✅ UI contrast enhancements
- ✅ Visual improvements
- ✅ Bug fixes

### Backend Improvements
- ✅ Migrated to MySQL
- ✅ Removed legacy SQLite/SQL Server code
- ✅ JWT authentication
- ✅ RESTful API structure
