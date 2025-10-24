# ME Management Modernization

This document describes the modernized ME Management application architecture and how to run it.

## Overview

The application has been completely modernized from:
- **Old Stack**: Spring Boot (Java) + React
- **New Stack**: ASP.NET Core 8 (C#) + Angular 20 + PrimeNG + Tailwind CSS

## Architecture

### Backend (/server)

The backend is built using ASP.NET Core 8 with a clean architecture:

```
/server
├── Server.BusinessObjects    # Domain models, DTOs, entities
├── Server.DataAccess         # EF Core, DbContext, repositories
├── Server.BusinessLogic      # Business rules, PDF generation
└── Server.Api                # REST API, JWT authentication, controllers
```

**Key Features:**
- JWT-based authentication
- SQLite database with Entity Framework Core
- Clean separation of concerns
- Professional PDF generation using QuestPDF
- CORS configured for Angular frontend
- RESTful API endpoints

**Entities:**
- User (authentication)
- Customer (Kunden)
- Invoice (Rechnungen) with line items
- Offer (Angebote) with line items
- Position (service catalog)
- Contract with positions

### Frontend (/client)

The frontend is built using Angular 20 with PrimeNG UI components and Tailwind CSS:

```
/client/src/app
├── core/
│   ├── guards/          # Route guards (AuthGuard)
│   ├── interceptors/    # HTTP interceptors (JWT token injection)
│   ├── models/          # TypeScript interfaces
│   └── services/        # API services, authentication
├── modules/
│   ├── auth/            # Login component
│   ├── dashboard/       # Dashboard
│   ├── customers/       # Customer management
│   ├── invoices/        # Invoice management with PDF download
│   ├── offers/          # Offer management with PDF download
│   └── settings/        # Settings
└── shared/
    └── components/      # Layout, sidebar, topbar
```

**Key Features:**
- JWT-based authentication with auto-redirect
- Modern, responsive UI with PrimeNG components
- Tailwind CSS for styling
- German business terminology (Rechnung, Angebot, Kunde, etc.)
- PDF download functionality for invoices and offers
- Toast notifications for user feedback
- Protected routes with AuthGuard

## Getting Started

### Prerequisites

- .NET 8 SDK or later
- Node.js 18+ and npm
- SQL Server or SQL Server LocalDB
- Any modern web browser

### Running the Backend

1. Navigate to the server directory:
```bash
cd server
```

2. Update the connection string in `Server.Api/appsettings.json` to point to your SQL Server instance (or use the default LocalDB):
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=MEManagement;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
  }
}
```

3. Apply database migrations:
```bash
cd Server.Api
dotnet ef database update
```

This will create the database and all necessary tables.

4. Build the solution:
```bash
cd ..
dotnet build
```

5. Run the API:
```bash
cd Server.Api
dotnet run
```

The API will start on `http://localhost:5000` by default.

**Note:** On first run, the application will automatically seed a default admin user:
- Username: `admin`
- Password: `admin`

### Running the Frontend

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:4200`.

## Default Credentials

- **Username:** admin
- **Password:** admin

## API Endpoints

### Authentication
- `POST /api/auth/login` - Authenticate and receive JWT token

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/{id}` - Get customer by ID
- `POST /api/customers` - Create customer
- `PUT /api/customers/{id}` - Update customer
- `DELETE /api/customers/{id}` - Delete customer

### Invoices (Rechnungen)
- `GET /api/invoices` - Get all invoices
- `GET /api/invoices/{id}` - Get invoice by ID
- `GET /api/invoices/customer/{customerId}` - Get invoices by customer
- `POST /api/invoices` - Create invoice
- `PUT /api/invoices/{id}` - Update invoice
- `DELETE /api/invoices/{id}` - Delete invoice
- `GET /api/invoices/{id}/pdf` - Download invoice PDF

### Offers (Angebote)
- `GET /api/offers` - Get all offers
- `GET /api/offers/{id}` - Get offer by ID
- `GET /api/offers/customer/{customerId}` - Get offers by customer
- `POST /api/offers` - Create offer
- `PUT /api/offers/{id}` - Update offer
- `DELETE /api/offers/{id}` - Delete offer
- `GET /api/offers/{id}/pdf` - Download offer PDF

All endpoints except `/api/auth/login` require a valid JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Key Technologies

### Backend
- **ASP.NET Core 8**: Web API framework
- **Entity Framework Core 8**: ORM for database access
- **SQLite**: Lightweight database
- **QuestPDF**: Professional PDF generation
- **JWT Authentication**: Secure token-based authentication
- **Swagger/OpenAPI**: API documentation

### Frontend
- **Angular 20**: Modern web framework
- **PrimeNG**: Rich UI component library
- **Tailwind CSS**: Utility-first CSS framework
- **RxJS**: Reactive programming
- **TypeScript**: Type-safe JavaScript

## Development Notes

### Adding New Features

1. **Backend**: Follow the layered architecture
   - Add entities to `Server.BusinessObjects`
   - Add repository to `Server.DataAccess`
   - Add service to `Server.BusinessLogic`
   - Add controller to `Server.Api`

2. **Frontend**: Use Angular best practices
   - Add models to `core/models`
   - Add services to `core/services`
   - Add components to `modules`
   - Update routing in `app.routes.ts`

### Database Migrations

To add a new migration after changing entities:

```bash
cd server/Server.Api
dotnet ef migrations add MigrationName
dotnet ef database update
```

### Building for Production

**Backend:**
```bash
cd server
dotnet publish -c Release -o publish
```

**Frontend:**
```bash
cd client
npm run build
```

The production build will be in `client/dist/client/browser`.

## Features

### Authentication & Authorization
- JWT-based login system
- Automatic token refresh
- Protected routes with AuthGuard
- Logout functionality

### Customer Management
- List all customers with pagination
- Search and filter capabilities
- Create, edit, and delete customers

### Invoice Management (Rechnungen)
- Create invoices with multiple line items
- Track invoice status (Draft, Sent, Paid, Overdue, Cancelled)
- Calculate totals automatically (net, tax, gross)
- Generate professional PDF invoices
- Download invoices as PDF

### Offer Management (Angebote)
- Create offers/quotes with multiple line items
- Track offer status (Draft, Sent, Accepted, Rejected, Expired)
- Calculate totals automatically
- Generate professional PDF offers
- Download offers as PDF

### PDF Generation
- Clean, professional layout
- Company header with contact information
- Customer details
- Itemized table with quantities, prices, and totals
- Tax breakdown by rate
- Summary section with net, tax, and gross totals
- German language and EUR currency formatting

## Troubleshooting

### Backend Issues

**Database locked error:**
- Stop all running instances of the API
- Delete `memanagement.db-wal` and `memanagement.db-shm` files
- Restart the API

**CORS errors:**
- Verify the Angular app is running on `http://localhost:4200`
- Check CORS configuration in `Server.Api/Program.cs`

### Frontend Issues

**Authentication not working:**
- Ensure the backend API is running
- Check the API URL in `src/environments/environment.ts`
- Clear browser localStorage and try again

**Styles not loading:**
- Run `npm install` to ensure all dependencies are installed
- Check that Tailwind CSS and PrimeNG are properly configured

## Future Enhancements

- Complete CRUD dialogs for all entities
- Advanced filtering and search
- Data export (Excel, CSV)
- Email notifications for invoices and offers
- Multi-user support with roles and permissions
- Dashboard statistics and charts
- Contract management integration
- Position/service catalog management
- Transaction/finance tracking

## License

Internal business application - All rights reserved.
