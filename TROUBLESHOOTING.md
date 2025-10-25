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

### 1. Missing Database Setup ✅ RESOLVED

**Error:**
Backend fails to start with database-related errors.

**Cause:**
MySQL connection not configured or database doesn't exist.

**Solution:**
1. Ensure MySQL is running
2. Create the database if it doesn't exist:
```sql
CREATE DATABASE IF NOT EXISTS memanagement CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
3. Update connection string in `server/Server.Api/appsettings.json`

The application will automatically create necessary tables on first run using `EnsureCreated()`.

**Note:** The backend now uses MySQL only. SQLite and SQL Server support has been removed.

---

### 2. MySQL Connection Issues

**Error:**
```
Unable to connect to any of the specified MySQL hosts
```

**Solutions:**

#### Option 1: Use Local MySQL Server (Default)

Connection string:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=3306;Database=memanagement;User=root;Password=your_secure_password;AllowPublicKeyRetrieval=True"
  }
}
```

Check if MySQL is running:
```bash
# Linux
systemctl status mysql

# macOS
brew services list

# Windows
# Check Services in Task Manager
```

If not installed, install MySQL Server 5.7+ or MariaDB 10.2+.

#### Option 2: Use Remote MySQL Server

Update `server/Server.Api/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=192.168.0.88;Port=3306;Database=memanagement;User=root;Password=your_secure_password;AllowPublicKeyRetrieval=True"
  }
}
```

Replace:
- `192.168.0.88` with your MySQL server IP
- `root` with your MySQL username
- `your_secure_password` with your actual MySQL password

#### Option 3: Use Docker MySQL

Run MySQL in Docker:
```bash
docker run --name mysql-memanagement -e MYSQL_ROOT_PASSWORD=your_secure_password -e MYSQL_DATABASE=memanagement -p 3306:3306 -d mysql:8.0
```

Connection string:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=3306;Database=memanagement;User=root;Password=your_secure_password;AllowPublicKeyRetrieval=True"
  }
}
```

#### Common MySQL Connection Issues

**Authentication Failed:**
```sql
-- Grant privileges to user
GRANT ALL PRIVILEGES ON memanagement.* TO 'root'@'%';
FLUSH PRIVILEGES;
```

**Can't Connect from Remote Host:**
```bash
# Edit MySQL config (Linux)
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf

# Change bind-address from 127.0.0.1 to 0.0.0.0
bind-address = 0.0.0.0

# Restart MySQL
sudo systemctl restart mysql
```

**Firewall Blocking:**
```bash
# Linux - Allow MySQL port
sudo ufw allow 3306

# Windows - Add firewall rule for port 3306
```

For more MySQL troubleshooting, see [MySQL Setup Guide](MYSQL_MIGRATION_GUIDE.md).

---

### 3. Database Tables Not Created

**Error:**
```
Table 'memanagement.Users' doesn't exist
```

**Solution:**
The application uses `EnsureCreated()` to automatically create tables on first run. If this fails:

1. Check that the MySQL user has CREATE TABLE privileges:
```sql
SHOW GRANTS FOR 'root'@'%';
```

2. Manually verify database exists:
```sql
SHOW DATABASES;
USE memanagement;
SHOW TABLES;
```

3. Check backend console output for error messages during startup.

---

## Integration Issues

### 1. CORS Errors - FIXED

**Error:**
```
Access to XMLHttpRequest at 'http://localhost:5000/api/...' from origin 'http://localhost:4200' has been blocked by CORS policy
```

**Common Symptom:**
Random CORS errors on different endpoints (customers, transactions, etc.) that appear intermittently.

**Root Causes:**
1. **Preflight requests failing** - Browser sends OPTIONS requests before actual API calls, and these were not being cached properly
2. **Wildcard header exposure** - Using `WithExposedHeaders("*")` doesn't work properly with `AllowCredentials()`
3. **Middleware ordering** - CORS middleware must be applied before all other middleware

**Solution (Already Fixed):**
The CORS configuration in `server/Server.Api/Program.cs` has been updated with:

1. **Explicit exposed headers** instead of wildcard:
```csharp
.WithExposedHeaders("Content-Length", "Content-Type", "Authorization", "X-Requested-With")
```

2. **Preflight caching** to reduce repeated OPTIONS requests:
```csharp
.SetPreflightMaxAge(TimeSpan.FromMinutes(10))
```

3. **Correct middleware ordering** - UseCors is called FIRST:
```csharp
// Configure the HTTP request pipeline

// IMPORTANT: UseCors must be called FIRST, before any other middleware
app.UseCors("AllowAngularApp");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();
app.UseAuthorization();
```

**If you need to add additional ports:**
Update the origins list in `server/Server.Api/Program.cs`:
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy =>
    {
        policy.WithOrigins(
                "http://localhost:4200",  // Angular default port
                "http://localhost:4201",  // Alternative port
                "http://localhost:4202",  // Alternative port
                "http://127.0.0.1:4200",  // Localhost alias
                "http://localhost:4203"   // Add your custom port here (replace 4203 with your port)
              )
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials()
              .SetPreflightMaxAge(TimeSpan.FromMinutes(10))
              .WithExposedHeaders("Content-Length", "Content-Type", "Authorization", "X-Requested-With");
    });
});
```

**Update Frontend API URL:**
If you change the backend port, update `client/src/environments/environment.ts`:
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
