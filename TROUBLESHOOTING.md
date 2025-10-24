# Troubleshooting Guide

This document addresses common issues and their solutions for the ME Management application.

## Frontend Issues

### 1. URL Construction Error in Development Mode ✅ RESOLVED

**Error:**
```
Uncaught TypeError: Failed to construct 'URL': Invalid URL
    at LoginComponent_HmrLoad (login.component.ts:95:28)
```

**Cause:**
Hot Module Replacement (HMR) in Angular development mode was trying to use `import.meta.url` which was not properly resolved.

**Solution:**
Disabled HMR in `angular.json`:
```json
"configurations": {
  "development": {
    "buildTarget": "client:build:development",
    "hmr": false
  }
}
```

**Fixed in commit:** b1e5071

---

### 2. Build Errors - Tailwind CSS and PrimeNG

**Error:**
```
Error: It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin
```

**Solution:**
See `FRONTEND_FIXES.md` for complete details.

**Fixed in commit:** 009539c

---

## Backend Issues

### 1. Missing Database Migration ✅ RESOLVED

**Error:**
Backend fails to start with database-related errors.

**Cause:**
No database migrations existed. Application was configured to auto-create database but needed explicit migrations for SQL Server.

**Solution:**
Created initial migration:
```bash
cd server/Server.Api
dotnet ef migrations add InitialCreate --project ../Server.DataAccess
dotnet ef database update
```

**Fixed in commit:** b705630

---

### 2. SQL Server Connection Issues

**Error:**
```
A network-related or instance-specific error occurred while establishing a connection to SQL Server
```

**Solutions:**

#### Option 1: Use SQL Server LocalDB (Default)
LocalDB is included with Visual Studio and SQL Server Express.

Connection string:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=MEManagement;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
  }
}
```

Check if LocalDB is installed:
```bash
sqllocaldb info
```

If not installed, download SQL Server Express with LocalDB from Microsoft.

#### Option 2: Use Full SQL Server Instance

Update `server/Server.Api/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=MEManagement;User Id=sa;Password=YourPassword;TrustServerCertificate=True"
  }
}
```

Or use Windows Authentication:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=MEManagement;Integrated Security=True;TrustServerCertificate=True"
  }
}
```

#### Option 3: Use Docker SQL Server

Run SQL Server in Docker:
```bash
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourStrong@Password" -p 1433:1433 --name sqlserver -d mcr.microsoft.com/mssql/server:2022-latest
```

Connection string:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;Database=MEManagement;User Id=sa;Password=YourStrong@Password;TrustServerCertificate=True"
  }
}
```

---

### 3. Entity Framework Tools Not Found

**Error:**
```
dotnet-ef does not exist
```

**Solution:**
Install EF Core tools globally:
```bash
dotnet tool install --global dotnet-ef --version 8.0.11
```

Or update if already installed:
```bash
dotnet tool update --global dotnet-ef --version 8.0.11
```

---

## Integration Issues

### 1. CORS Errors

**Error:**
```
Access to XMLHttpRequest at 'http://localhost:5000/api/...' from origin 'http://localhost:4200' has been blocked by CORS policy
```

**Solution:**
This is already configured in `Program.cs`, but if you change the frontend port:

1. Update CORS policy in `server/Server.Api/Program.cs`:
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy =>
    {
        policy.WithOrigins("http://localhost:4200") // Update port if needed
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});
```

2. Update API URL in `client/src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api' // Update port if needed
};
```

---

### 2. JWT Authentication Not Working

**Symptom:**
Login succeeds but subsequent API calls return 401 Unauthorized.

**Solutions:**

1. Check browser localStorage has the token:
   - Open DevTools (F12)
   - Go to Application/Storage → Local Storage
   - Look for `currentUser` key
   - Should contain: `{"username":"admin","displayName":"Administrator","token":"eyJ..."}`

2. Check Authorization header is sent:
   - Open DevTools → Network tab
   - Make an API call
   - Check request headers for: `Authorization: Bearer <token>`

3. If token is missing, check the HTTP interceptor is registered in `app.config.ts`:
```typescript
provideHttpClient(withInterceptors([authInterceptor]))
```

---

## Development Environment Issues

### 1. Node Modules Not Found

**Error:**
```
sh: 1: ng: not found
```

**Solution:**
```bash
cd client
npm install
```

---

### 2. Port Already in Use

**Error:**
```
Port 4200 is already in use
Port 5000 is already in use
```

**Solution:**

For frontend (Angular):
```bash
# Kill process on port 4200
# Windows
netstat -ano | findstr :4200
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:4200 | xargs kill -9

# Or use different port
ng serve --port 4201
```

For backend (API):
```bash
# Kill process on port 5000
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9

# Or update launchSettings.json to use different port
```

---

## Build Issues

### 1. Bundle Size Too Large

**Warning:**
```
bundle initial exceeded maximum budget
```

**Solution:**
Already resolved by increasing budgets in `angular.json`. If you need to reduce bundle size:

1. Use lazy loading for feature modules
2. Enable production optimizations:
```bash
ng build --configuration production
```

---

### 2. .NET Build Fails

**Error:**
```
error CS0246: The type or namespace name 'X' could not be found
```

**Solution:**
Restore NuGet packages:
```bash
cd server
dotnet restore
dotnet build
```

---

## Common Workflow Issues

### 1. Changes Not Reflecting

**Frontend:**
- Hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
- Clear browser cache
- Restart dev server: `npm start`

**Backend:**
- Rebuild: `dotnet build`
- Restart server: Stop (Ctrl+C) and `dotnet run`

---

### 2. Database Out of Sync

**Symptom:**
Error about missing tables or columns.

**Solution:**
```bash
cd server/Server.Api
dotnet ef database drop  # Warning: deletes all data!
dotnet ef database update
```

Or to preserve data, create a new migration:
```bash
dotnet ef migrations add UpdateSchema --project ../Server.DataAccess
dotnet ef database update
```

---

## Getting Help

If you encounter an issue not listed here:

1. Check the browser console (F12) for frontend errors
2. Check the API terminal output for backend errors
3. Check the commit history for recent changes
4. Review the comprehensive documentation:
   - `README_MODERNIZATION.md` - Setup and architecture
   - `FRONTEND_FIXES.md` - Frontend error solutions
   - This file - Troubleshooting guide

---

## Quick Reference

### Useful Commands

**Frontend:**
```bash
cd client
npm install              # Install dependencies
npm start               # Start dev server
npm run build           # Build for production
npm run build -- --watch  # Build and watch
```

**Backend:**
```bash
cd server
dotnet build            # Build solution
dotnet run              # Run from current directory
dotnet ef migrations add <Name> --project Server.DataAccess --startup-project Server.Api
dotnet ef database update --project Server.Api
dotnet ef database drop --project Server.Api
```

**Both:**
```bash
# Windows
start-backend.bat
start-frontend.bat

# Linux/Mac
./start-backend.sh
./start-frontend.sh
```
