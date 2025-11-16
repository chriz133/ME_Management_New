# CI/CD Deployment Implementation Summary

## Overview
This implementation adds automatic deployment capabilities for the ME Management application to an Apache web server in a local network. When code is pushed to the `main` branch, the application is automatically built and deployed.

## What Was Implemented

### 1. GitHub Actions Workflow (`.github/workflows/deploy.yml`)
Automated deployment pipeline that:
- **Triggers**: On push to `main` branch or manual workflow dispatch
- **Builds**: Both .NET API and Angular frontend
- **Deploys**: To `/var/www/memanagement-api` and `/var/www/memanagement-app`
- **Backups**: Creates timestamped backups before each deployment (keeps last 5)
- **Services**: Manages systemd service restart for API
- **Apache**: Reloads Apache configuration after frontend deployment

### 2. Server Configuration Files

#### Systemd Service (`deployment/memanagement-api.service`)
- Runs .NET API as a background service
- Auto-restart on failure
- Runs under `www-data` user
- Listens on `http://localhost:5000`

#### Apache Configuration (`deployment/apache-memanagement.conf`)
- Serves Angular app from document root
- Reverse proxy for API at `/api` endpoint
- Angular routing support (SPA configuration)
- WebSocket support for real-time features
- Includes commented HTTPS configuration template

#### Setup Script (`deployment/setup-server.sh`)
Automated installation script that:
- Installs Apache and required modules
- Installs .NET 8 runtime
- Creates application directories
- Configures systemd service
- Sets up Apache virtual host
- Configures firewall

### 3. Application Configuration Updates

#### Angular (`client/`)
- **angular.json**: Added explicit `outputPath` configuration
- **environment.prod.ts**: Changed API URL to `/api` (relative path)
  - Works with Apache reverse proxy
  - No hardcoded server addresses needed

#### .NET API (`server/Server.Api/`)
- **appsettings.json**: Added CORS configuration section
- **appsettings.Production.json**: Production-specific settings
  - Production CORS origins (update with your server IP/hostname)
  - Reduced logging verbosity
- **Program.cs**: Updated to read CORS from configuration

#### Dependency Fix
- **Server.BusinessLogic**: Updated QuestPDF from 2024.10.3 to 2024.12.3
  - Fixes version conflict with Server.Api
  - Ensures successful publish

### 4. Documentation

#### Main Deployment Guide (`DEPLOYMENT.md`)
Comprehensive guide covering:
- Architecture overview
- Server requirements and setup
- GitHub Actions self-hosted runner setup
- Apache and systemd configuration
- Security recommendations
- Monitoring and troubleshooting
- Rollback procedures

#### Deployment Directory README (`deployment/README.md`)
Quick reference for:
- Configuration file descriptions
- Installation commands
- Quick start guide
- Manual setup instructions

## Architecture

```
                    Internet
                       |
                       v
                 [Firewall/Router]
                       |
                       v
                  [Apache Server]
                       |
         +-------------+-------------+
         |                           |
         v                           v
  [Static Files]            [Reverse Proxy]
  Angular App               /api -> :5000
  /var/www/memanagement-app        |
                                   v
                          [Systemd Service]
                          .NET API (Kestrel)
                          /var/www/memanagement-api
                                   |
                                   v
                              [MySQL DB]
                              192.168.0.88:3306
```

## How It Works

### Development Flow
1. Developer makes changes to code
2. Developer commits and pushes to `main` branch
3. GitHub Actions workflow triggers

### Deployment Flow
1. **Checkout**: GitHub runner pulls latest code
2. **Build Backend**: 
   - Restore NuGet packages
   - Build .NET solution in Release mode
   - Publish to temporary directory
3. **Build Frontend**:
   - Install npm dependencies
   - Build Angular app for production
4. **Deploy Backend**:
   - Stop API service
   - Create timestamped backup
   - Copy new files to `/var/www/memanagement-api`
   - Set permissions
   - Start API service
5. **Deploy Frontend**:
   - Create timestamped backup
   - Copy new files to `/var/www/memanagement-app`
   - Set permissions
   - Reload Apache
6. **Cleanup**: Remove old backups (keep last 5)

### Runtime Flow
1. User accesses `http://YOUR_SERVER`
2. Apache serves Angular index.html
3. Angular app loads in browser
4. API calls go to `/api/*`
5. Apache proxies `/api/*` to `http://localhost:5000`
6. .NET API processes request
7. Response returned through proxy to Angular app

## Server Requirements

- **OS**: Ubuntu 20.04+ or Debian 11+
- **Software**:
  - Apache 2.4+ with modules: proxy, proxy_http, rewrite, ssl
  - .NET 8 Runtime
  - MySQL 8.0+ (already configured)
- **Runner**: GitHub Actions self-hosted runner
- **Permissions**: Runner user needs sudo access for deployment tasks

## Setup Process (Summary)

1. **Prepare Server**:
   ```bash
   sudo ./deployment/setup-server.sh
   ```

2. **Setup GitHub Runner**:
   - Go to repo Settings → Actions → Runners
   - Add new self-hosted runner
   - Follow installation instructions
   - Grant sudo permissions (see DEPLOYMENT.md)

3. **Configure Production Settings**:
   - Update `server/Server.Api/appsettings.Production.json`
   - Add your server IP/hostname to CORS origins
   - Update Apache configuration with your ServerName

4. **Deploy**:
   - Push to `main` branch
   - Workflow runs automatically
   - Application available at `http://YOUR_SERVER`

## Configuration Customization

### Update Server Address
In `server/Server.Api/appsettings.Production.json`:
```json
{
  "Cors": {
    "AllowedOrigins": [
      "http://localhost",
      "http://YOUR_SERVER_IP",
      "http://YOUR_HOSTNAME"
    ]
  }
}
```

In `deployment/apache-memanagement.conf`:
```apache
ServerName YOUR_HOSTNAME_OR_IP
```

### Enable HTTPS
1. Obtain SSL certificate (e.g., Let's Encrypt)
2. Uncomment HTTPS VirtualHost in `apache-memanagement.conf`
3. Update certificate paths
4. Enable SSL module: `sudo a2enmod ssl`
5. Update CORS origins to include `https://`

## Testing

✅ **Backend Build**: Tested successfully
✅ **Backend Publish**: Tested successfully  
✅ **Frontend Build**: Tested successfully
✅ **Output Structure**: Verified correct
✅ **Dependency Conflicts**: Fixed QuestPDF version mismatch

## Security Considerations

1. **Secrets**: Update JWT secret in production
2. **Database**: Use strong passwords, restrict network access
3. **HTTPS**: Recommended for production (template provided)
4. **Firewall**: Only expose necessary ports
5. **Updates**: Keep all software up to date
6. **Permissions**: Runner sudo access is scoped to specific commands

## Monitoring

### Check API Status
```bash
sudo systemctl status memanagement-api
sudo journalctl -u memanagement-api -f
```

### Check Apache Status
```bash
sudo systemctl status apache2
sudo tail -f /var/log/apache2/memanagement_error.log
```

### Check Deployment
GitHub Actions → Workflow runs → Latest run

## Rollback

Backups are created automatically. To rollback:
```bash
# Stop service
sudo systemctl stop memanagement-api

# Restore from backup
sudo rm -rf /var/www/memanagement-api
sudo mv /var/www/memanagement-api.backup.TIMESTAMP /var/www/memanagement-api

# Start service
sudo systemctl start memanagement-api
```

## Troubleshooting

See `DEPLOYMENT.md` for detailed troubleshooting steps covering:
- Service fails to start
- Apache configuration errors
- Deployment workflow failures
- Permission issues
- Database connection problems

## Next Steps

After merging this PR:

1. ✅ Set up Linux server with provided scripts
2. ✅ Configure GitHub self-hosted runner
3. ✅ Update production configuration with your server details
4. ✅ Merge to main to trigger first deployment
5. ✅ Test application access
6. ✅ Configure HTTPS (recommended)
7. ✅ Set up monitoring/alerting as needed

## Files Changed

- **New**: `.github/workflows/deploy.yml`
- **New**: `deployment/memanagement-api.service`
- **New**: `deployment/apache-memanagement.conf`
- **New**: `deployment/setup-server.sh`
- **New**: `deployment/README.md`
- **New**: `DEPLOYMENT.md`
- **New**: `DEPLOYMENT_SUMMARY.md` (this file)
- **New**: `server/Server.Api/appsettings.Production.json`
- **Modified**: `client/angular.json`
- **Modified**: `client/src/environments/environment.prod.ts`
- **Modified**: `server/Server.Api/appsettings.json`
- **Modified**: `server/Server.Api/Program.cs`
- **Modified**: `server/Server.BusinessLogic/Server.BusinessLogic.csproj`

## Support

For issues or questions:
1. Check `DEPLOYMENT.md` for detailed documentation
2. Review workflow logs in GitHub Actions
3. Check server logs (`journalctl`, Apache logs)
4. Review configuration files in `deployment/` directory
