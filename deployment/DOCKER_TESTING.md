# Docker Testing Guide

This guide helps you test the deployment setup locally using Docker before deploying to your actual server.

## Quick Start

```bash
# Run the test script
./deployment/test-deployment.sh
```

This will:
1. Create a Docker container simulating your Apache server
2. Set up MySQL database
3. Configure Apache with the same settings as production
4. Start the test environment

## Testing Deployment

### Option 1: Manual Deployment Test

After starting the test environment, manually deploy the applications:

```bash
# Build .NET API
dotnet publish server/Server.Api/Server.Api.csproj -c Release -o deployment/test-data/api

# Build Angular app
cd client
npm run build
cp -r dist/client/browser/* ../deployment/test-data/app/

# Access the application
# Open browser: http://localhost:8080
```

### Option 2: Simulate GitHub Actions Workflow

You can test the deployment workflow steps locally:

```bash
# 1. Build .NET API
cd server
dotnet restore MEManagement.sln
dotnet build MEManagement.sln --configuration Release --no-restore
dotnet publish Server.Api/Server.Api.csproj --configuration Release --output ../deployment/test-data/api --no-restore

# 2. Build Angular app
cd ../client
npm ci
npm run build

# 3. Deploy to test container
cp -r dist/client/browser/* ../deployment/test-data/app/

# 4. Restart Apache in container
docker exec memanagement-test-server apachectl graceful
```

## Accessing the Test Environment

- **Frontend**: http://localhost:8080
- **API**: http://localhost:8080/api
- **MySQL**: localhost:3307
  - User: chriz
  - Password: test_password
  - Database: firmaDB

## Useful Commands

```bash
# View all logs
cd deployment
docker-compose -f docker-compose.test.yml logs -f

# View Apache logs only
docker-compose -f docker-compose.test.yml logs -f test-server

# Access container shell
docker exec -it memanagement-test-server bash

# Check Apache status
docker exec memanagement-test-server apachectl status

# Restart Apache
docker exec memanagement-test-server apachectl restart

# Stop test environment
cd deployment
docker-compose -f docker-compose.test.yml down

# Stop and remove all data
cd deployment
docker-compose -f docker-compose.test.yml down -v
```

## Testing GitHub Actions Runner

While you can't fully test the GitHub Actions runner without setting it up, you can:

1. **Verify builds work** - Run the build commands above
2. **Test deployment scripts** - Manually copy files to test-data directories
3. **Verify Apache configuration** - Access http://localhost:8080

## Differences from Production

This Docker setup simulates the production environment but has some differences:

| Aspect | Docker Test | Production |
|--------|-------------|------------|
| Port | 8080 | 80 |
| MySQL Port | 3307 | 3306 |
| Systemd Service | Not used | Used for .NET API |
| GitHub Runner | Manual testing | Automatic deployment |
| Data Persistence | Docker volumes | Server filesystem |

## Troubleshooting

### Container won't start

```bash
# Check logs
docker-compose -f deployment/docker-compose.test.yml logs

# Rebuild
docker-compose -f deployment/docker-compose.test.yml up -d --build --force-recreate
```

### Apache errors

```bash
# Check Apache error log
docker exec memanagement-test-server cat /var/log/apache2/error.log

# Check Apache configuration
docker exec memanagement-test-server apachectl configtest
```

### Can't access http://localhost:8080

```bash
# Check if container is running
docker ps | grep memanagement-test-server

# Check port mapping
docker port memanagement-test-server

# Check if Apache is running inside container
docker exec memanagement-test-server ps aux | grep apache
```

## After Testing

Once you've verified everything works in Docker:

1. **Stop the test environment**:
   ```bash
   cd deployment
   docker-compose -f docker-compose.test.yml down
   ```

2. **Set up your actual server** using the instructions in QUICKSTART.md

3. **Key differences to remember**:
   - Production uses systemd for the .NET API (not just Apache)
   - Production needs GitHub self-hosted runner
   - Production uses your actual server IP/hostname

## Benefits of Docker Testing

✅ Test deployment without affecting your production server
✅ Verify Apache configuration works
✅ Test application builds successfully
✅ Identify issues early
✅ Easy to reset and try again

## Limitations

⚠️ GitHub Actions runner not included (needs actual GitHub connection)
⚠️ Systemd service not fully functional in Docker
⚠️ Different port numbers (8080 vs 80)

For full deployment testing, you'll still need to set up the actual server, but Docker testing helps catch configuration issues early!
