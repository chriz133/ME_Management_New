# Deployment Guide - ME Management Application

This guide explains how to set up automatic deployment of the ME Management application (Angular frontend + .NET backend) to an Apache web server in your local network.

## Architecture Overview

- **Frontend**: Angular application served by Apache
- **Backend**: .NET 8 API running as a systemd service, proxied through Apache
- **Deployment**: Automatic via GitHub Actions on push to `main` branch
- **Server**: Self-hosted runner in local network

## Prerequisites

### Server Requirements

1. **Linux Server** (Ubuntu 20.04+ or Debian 11+ recommended)
2. **Apache 2.4+** with required modules
3. **.NET 8 Runtime**
4. **Node.js 20+** (for building Angular app)
5. **MySQL 8.0+** (already configured based on existing appsettings.json)

### Required Apache Modules

```bash
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod proxy_wstunnel
sudo a2enmod rewrite
sudo a2enmod ssl  # Optional, for HTTPS
sudo systemctl restart apache2
```

## Server Setup

### 1. Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Apache
sudo apt install apache2 -y

# Install .NET 8 Runtime
wget https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
rm packages-microsoft-prod.deb
sudo apt update
sudo apt install -y dotnet-runtime-8.0 aspnetcore-runtime-8.0

# Verify .NET installation
dotnet --version
```

### 2. Create Application Directories

```bash
# Create directories for API and Frontend
sudo mkdir -p /var/www/memanagement-api
sudo mkdir -p /var/www/memanagement-app

# Set ownership
sudo chown -R www-data:www-data /var/www/memanagement-api
sudo chown -R www-data:www-data /var/www/memanagement-app
```

### 3. Configure Systemd Service for .NET API

```bash
# Copy the service file
sudo cp deployment/memanagement-api.service /etc/systemd/system/

# Reload systemd
sudo systemctl daemon-reload

# Enable service to start on boot
sudo systemctl enable memanagement-api

# Note: The service will be started by the deployment workflow
```

### 4. Configure Apache Virtual Host

```bash
# Copy Apache configuration
sudo cp deployment/apache-memanagement.conf /etc/apache2/sites-available/

# Update ServerName in the configuration file
sudo nano /etc/apache2/sites-available/apache-memanagement.conf
# Change ServerName to your server's IP or hostname

# Enable the site
sudo a2ensite apache-memanagement.conf

# Disable default site (optional)
sudo a2dissite 000-default.conf

# Test Apache configuration
sudo apache2ctl configtest

# Reload Apache
sudo systemctl reload apache2
```

### 5. Configure Firewall

```bash
# Allow HTTP and HTTPS traffic
sudo ufw allow 'Apache Full'
sudo ufw enable
```

## GitHub Actions Setup

### 1. Set Up Self-Hosted Runner

Since the server is in your local network, you need to set up a GitHub self-hosted runner:

1. Go to your GitHub repository
2. Navigate to **Settings** → **Actions** → **Runners**
3. Click **New self-hosted runner**
4. Follow the instructions to download and configure the runner on your Linux server

#### Install and Configure Runner

```bash
# Create a folder for the runner
mkdir ~/actions-runner && cd ~/actions-runner

# Download the latest runner package (check GitHub for current version)
curl -o actions-runner-linux-x64-2.311.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-linux-x64-2.311.0.tar.gz

# Extract the installer
tar xzf ./actions-runner-linux-x64-2.311.0.tar.gz

# Configure the runner (use the token from GitHub)
./config.sh --url https://github.com/chriz133/ME_Management_New --token YOUR_TOKEN_FROM_GITHUB

# Install as a service
sudo ./svc.sh install
sudo ./svc.sh start
```

### 2. Grant Runner Permissions

The runner needs sudo access for deployment tasks:

```bash
# Create a sudoers file for the runner user
sudo visudo -f /etc/sudoers.d/github-runner

# Add the following lines (replace 'runner-user' with actual runner username):
runner-user ALL=(ALL) NOPASSWD: /bin/systemctl start memanagement-api
runner-user ALL=(ALL) NOPASSWD: /bin/systemctl stop memanagement-api
runner-user ALL=(ALL) NOPASSWD: /bin/systemctl status memanagement-api
runner-user ALL=(ALL) NOPASSWD: /bin/systemctl reload apache2
runner-user ALL=(ALL) NOPASSWD: /bin/cp * /var/www/memanagement-api/*
runner-user ALL=(ALL) NOPASSWD: /bin/cp * /var/www/memanagement-app/*
runner-user ALL=(ALL) NOPASSWD: /bin/rm -rf /var/www/memanagement-app/*
runner-user ALL=(ALL) NOPASSWD: /bin/mkdir -p /var/www/memanagement-*
runner-user ALL=(ALL) NOPASSWD: /bin/chown -R www-data\:www-data /var/www/memanagement-*
runner-user ALL=(ALL) NOPASSWD: /bin/chmod -R 755 /var/www/memanagement-*
runner-user ALL=(ALL) NOPASSWD: /bin/ls *
```

## Application Configuration

### Update Angular API Endpoint

The Angular app needs to know where to call the API. Update the environment files:

1. For production, create/update `client/src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: '/api'  // Uses same domain with /api prefix
};
```

2. Ensure the app uses this environment configuration.

### Update .NET CORS Settings

In `server/Server.Api/Program.cs`, the CORS policy needs to include your server's domain:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy =>
    {
        policy.WithOrigins(
                "http://localhost:4200",
                "http://memanagement.local",  // Add your server domain
                "http://YOUR_SERVER_IP"        // Add your server IP
              )
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});
```

## Deployment Process

### Automatic Deployment

Once everything is set up, deployment happens automatically:

1. Push changes to the `main` branch
2. GitHub Actions workflow triggers
3. Self-hosted runner builds both applications
4. Applications are deployed to the server
5. Services are restarted automatically

### Manual Deployment

You can also trigger deployment manually:

1. Go to **Actions** tab in GitHub
2. Select **Deploy to Apache Server** workflow
3. Click **Run workflow**
4. Select branch and run

## Monitoring and Troubleshooting

### Check API Service Status

```bash
# View service status
sudo systemctl status memanagement-api

# View service logs
sudo journalctl -u memanagement-api -f

# Restart service manually
sudo systemctl restart memanagement-api
```

### Check Apache Status

```bash
# View Apache status
sudo systemctl status apache2

# View error logs
sudo tail -f /var/log/apache2/memanagement_error.log

# View access logs
sudo tail -f /var/log/apache2/memanagement_access.log
```

### Test Deployment

After deployment:

1. **Test Frontend**: Open `http://YOUR_SERVER_IP` in browser
2. **Test API**: Open `http://YOUR_SERVER_IP/api/swagger` (if enabled in production)
3. **Test Database Connection**: Login to the application

## Security Recommendations

1. **Enable HTTPS**: Obtain SSL certificates (Let's Encrypt) and configure HTTPS
2. **Update Secrets**: Change default JWT secret keys in `appsettings.json`
3. **Database Security**: Use strong database passwords and restrict network access
4. **Firewall**: Only allow necessary ports (80, 443, MySQL port only from app server)
5. **Regular Updates**: Keep all software updated

## Rollback Procedure

The deployment workflow creates backups before each deployment:

```bash
# List available backups
ls -lt /var/www/memanagement-*.backup.*

# Rollback API
sudo systemctl stop memanagement-api
sudo rm -rf /var/www/memanagement-api
sudo mv /var/www/memanagement-api.backup.TIMESTAMP /var/www/memanagement-api
sudo systemctl start memanagement-api

# Rollback Frontend
sudo rm -rf /var/www/memanagement-app/*
sudo cp -r /var/www/memanagement-app.backup.TIMESTAMP/* /var/www/memanagement-app/
sudo systemctl reload apache2
```

## Maintenance

### Cleanup Old Backups

The workflow automatically keeps the last 5 backups. To manually clean up:

```bash
cd /var/www
sudo ls -t memanagement-api.backup.* | tail -n +6 | xargs sudo rm -rf
sudo ls -t memanagement-app.backup.* | tail -n +6 | xargs sudo rm -rf
```

### Update Application

Simply push changes to the `main` branch. The workflow will:
1. Build new versions
2. Create backups
3. Deploy updates
4. Restart services

## Support

For issues or questions:
1. Check logs: `sudo journalctl -u memanagement-api -f`
2. Check Apache logs: `/var/log/apache2/memanagement_error.log`
3. Review GitHub Actions workflow runs for deployment errors
