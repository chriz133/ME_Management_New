# ME Management

A modern business management application for handling customers, contracts, invoices, and financial transactions.

## 🚀 Tech Stack

### Frontend
- **Angular 20** - Modern web framework
- **PrimeNG** - Rich UI component library
- **Tailwind CSS** - Utility-first CSS framework
- **RxJS** - Reactive programming library

### Backend
- **ASP.NET Core** - RESTful API backend
- **Entity Framework Core** - ORM for database operations
- **MySQL** - Relational database

### Development Tools
- **Docker** - Containerized MySQL development environment
- **Angular CLI** - Frontend development and build tools
- **.NET CLI** - Backend development and build tools

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [.NET SDK](https://dotnet.microsoft.com/download) (v8.0 or higher)
- [Docker Desktop](https://www.docker.com/products/docker-desktop) (for local database)
- [Angular CLI](https://angular.io/cli) (optional, for advanced commands)

## 🛠️ Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ME_Management_New
```

### 2. Start the Database

The project includes a Docker-based MySQL server for local development.

**Linux/macOS:**
```bash
./mysql-dev.sh start
```

**Windows:**
```cmd
mysql-dev.bat start
```

Wait 1-2 minutes for the database to initialize. You can check the status:
```bash
./mysql-dev.sh status
```

### 3. Start the Backend

**Linux/macOS:**
```bash
./start-backend.sh
```

**Windows:**
```cmd
start-backend.bat
```

The API will be available at `http://localhost:5000`
- Swagger documentation: `http://localhost:5000/swagger`

### 4. Start the Frontend

**Linux/macOS:**
```bash
./start-frontend.sh
```

**Windows:**
```cmd
start-frontend.bat
```

The application will be available at `http://localhost:4200`

### 5. Login

Use the default credentials:
- **Username:** `admin`
- **Password:** `admin`

## 📁 Project Structure

```
ME_Management_New/
├── client/                 # Angular frontend application
│   ├── src/
│   │   ├── app/           # Application components and services
│   │   ├── environments/  # Environment configurations
│   │   └── index.html     # Main HTML file
│   ├── package.json       # Frontend dependencies
│   └── angular.json       # Angular configuration
│
├── server/                # .NET backend application
│   ├── Server.Api/        # API controllers and endpoints
│   ├── Server.BusinessLogic/  # Business logic layer
│   ├── Server.BusinessObjects/ # Domain models
│   └── Server.DataAccess/ # Database access layer
│
├── docker-compose.dev.yml # Docker configuration for MySQL
├── mysql-dev.sh          # Database management script (Linux/macOS)
├── mysql-dev.bat         # Database management script (Windows)
├── start-backend.sh      # Backend startup script (Linux/macOS)
├── start-backend.bat     # Backend startup script (Windows)
├── start-frontend.sh     # Frontend startup script (Linux/macOS)
└── start-frontend.bat    # Frontend startup script (Windows)
```

## 🗄️ Database Management

### Connection Details

- **Server:** localhost:3306
- **Database:** firmaDB
- **Username:** devuser
- **Password:** devpassword
- **Connection String:** `Server=localhost;Port=3306;Database=firmaDB;User=devuser;Password=devpassword;AllowPublicKeyRetrieval=True`

### Common Database Commands

| Task | Linux/macOS | Windows |
|------|-------------|---------|
| Start server | `./mysql-dev.sh start` | `mysql-dev.bat start` |
| Stop server | `./mysql-dev.sh stop` | `mysql-dev.bat stop` |
| Check status | `./mysql-dev.sh status` | `mysql-dev.bat status` |
| View logs | `./mysql-dev.sh logs` | `mysql-dev.bat logs` |
| Connect to DB | `./mysql-dev.sh connect` | `mysql-dev.bat connect` |
| Reset database | `./mysql-dev.sh reset` | `mysql-dev.bat reset` |

### Sample Data

The database is automatically initialized with sample data:
- ✅ 33 customer records
- ✅ 50+ service/position records
- ✅ 18 contracts with line items
- ✅ 30+ invoices with line items
- ✅ 48 transaction records

## 💻 Development

### Frontend Development

Navigate to the client directory and work with Angular CLI:

```bash
cd client

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Generate a new component
ng generate component component-name
```

### Backend Development

Navigate to the server API directory:

```bash
cd server/Server.Api

# Build the project
dotnet build

# Run the API
dotnet run

# Apply database migrations
dotnet ef database update

# Create a new migration
dotnet ef migrations add MigrationName
```

### API Documentation

When the backend is running, you can access the Swagger UI at:
```
http://localhost:5000/swagger
```

This provides interactive API documentation and testing capabilities.

## 🔧 Configuration

### Frontend Configuration

Edit `client/src/environments/environment.ts` for development settings:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000'
};
```

### Backend Configuration

Edit `server/Server.Api/appsettings.Development.json` for development settings:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=3306;Database=firmaDB;User=devuser;Password=devpassword;AllowPublicKeyRetrieval=True"
  }
}
```

## 🧪 Testing

### Frontend Tests
```bash
cd client
npm test
```

### Backend Tests
```bash
cd server
dotnet test
```

## 🚀 Building for Production

### Frontend
```bash
cd client
npm run build
```
Build artifacts will be stored in the `client/dist/` directory.

### Backend
```bash
cd server/Server.Api
dotnet publish -c Release
```
Published files will be in `server/Server.Api/bin/Release/net8.0/publish/`

## 📝 Features

- **Customer Management** - Create, edit, and manage customer records
- **Contract Management** - Handle contracts and contract positions
- **Invoice Management** - Generate and manage invoices
- **Financial Tracking** - Track transactions and financial data
- **PDF Generation** - Export documents as PDF
- **Responsive Design** - Works on desktop, tablet, and mobile devices

## 🐛 Troubleshooting

### Database Connection Issues
- Ensure Docker Desktop is running
- Wait 1-2 minutes after starting the database for initialization
- Check if port 3306 is available: `netstat -an | grep 3306`
- View logs: `./mysql-dev.sh logs` or `mysql-dev.bat logs`

### Frontend Build Errors
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Angular cache: `ng cache clean`

### Backend Build Errors
- Clean and rebuild: `dotnet clean && dotnet build`
- Restore packages: `dotnet restore`
- Check .NET SDK version: `dotnet --version`

## 📄 License

This project is private and proprietary.

## 👥 Support

For support and questions, please contact the development team.
