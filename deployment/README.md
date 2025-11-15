# Deployment Configuration Files

This directory contains all the necessary configuration files for deploying the ME Management application to an Apache web server.

## Files in this Directory

### 1. `memanagement-api.service`
Systemd service file for running the .NET API as a background service.

**Installation:**
```bash
sudo cp memanagement-api.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable memanagement-api
sudo systemctl start memanagement-api
```

### 2. `apache-memanagement.conf`
Apache virtual host configuration for serving the Angular frontend and proxying API requests.

**Installation:**
```bash
sudo cp apache-memanagement.conf /etc/apache2/sites-available/
# Update ServerName in the file to match your server
sudo nano /etc/apache2/sites-available/apache-memanagement.conf
sudo a2ensite apache-memanagement.conf
sudo systemctl reload apache2
```

### 3. `setup-server.sh`
Automated setup script that configures the entire server.

**Usage:**
```bash
sudo ./setup-server.sh
```

This script will:
- Install Apache and enable required modules
- Install .NET 8 Runtime
- Create application directories
- Configure systemd service
- Set up Apache virtual host
- Configure firewall

## Quick Start

For a complete server setup from scratch:

1. **Clone the repository on your server:**
   ```bash
   git clone https://github.com/chriz133/ME_Management_New.git
   cd ME_Management_New
   ```

2. **Run the setup script:**
   ```bash
   sudo ./deployment/setup-server.sh
   ```

3. **Set up GitHub Actions self-hosted runner:**
   - Follow instructions in the main DEPLOYMENT.md file
   - Configure runner on your server
   - Grant necessary sudo permissions

4. **Configure production settings:**
   - Update `server/Server.Api/appsettings.Production.json` with your server's hostname/IP
   - Commit and push changes to trigger deployment

## Manual Installation

If you prefer to set up components manually, follow the detailed instructions in the main [DEPLOYMENT.md](../DEPLOYMENT.md) file in the root directory.

## Configuration Updates

After deployment, you may need to update:

- **Server hostname/IP**: Update in `apache-memanagement.conf` and `appsettings.Production.json`
- **CORS origins**: Update in `appsettings.Production.json`
- **SSL certificates**: Uncomment and configure HTTPS section in `apache-memanagement.conf`

## Troubleshooting

See the main [DEPLOYMENT.md](../DEPLOYMENT.md) file for troubleshooting tips and monitoring commands.
