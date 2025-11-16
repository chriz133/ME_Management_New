#!/bin/bash

# ME Management - Server Setup Script
# This script sets up the Linux server for deployment

set -e  # Exit on any error

echo "=========================================="
echo "ME Management Server Setup"
echo "=========================================="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "Please run as root or with sudo"
    exit 1
fi

# Get the server IP or hostname
read -p "Enter your server hostname or IP (e.g., memanagement.local or 192.168.0.88): " SERVER_NAME

echo ""
echo "Step 1: Installing Apache and enabling required modules..."
apt update
apt install -y apache2

# Enable required Apache modules
a2enmod proxy
a2enmod proxy_http
a2enmod proxy_wstunnel
a2enmod rewrite
a2enmod ssl

echo ""
echo "Step 2: Installing .NET 8 Runtime..."

# Detect Ubuntu/Debian version
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$ID
    VER=$VERSION_ID
fi

# Install .NET based on OS
if [ "$OS" = "ubuntu" ]; then
    wget https://packages.microsoft.com/config/ubuntu/${VER}/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
    dpkg -i packages-microsoft-prod.deb
    rm packages-microsoft-prod.deb
elif [ "$OS" = "debian" ]; then
    wget https://packages.microsoft.com/config/debian/${VER}/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
    dpkg -i packages-microsoft-prod.deb
    rm packages-microsoft-prod.deb
fi

apt update
apt install -y dotnet-runtime-8.0 aspnetcore-runtime-8.0

# Verify installation
dotnet --version

echo ""
echo "Step 3: Creating application directories..."
mkdir -p /var/www/memanagement-api
mkdir -p /var/www/memanagement-app

# Set ownership
chown -R www-data:www-data /var/www/memanagement-api
chown -R www-data:www-data /var/www/memanagement-app

echo ""
echo "Step 4: Setting up systemd service..."

# Copy service file from deployment directory
if [ -f "./deployment/memanagement-api.service" ]; then
    cp ./deployment/memanagement-api.service /etc/systemd/system/
    systemctl daemon-reload
    systemctl enable memanagement-api
    echo "Systemd service configured"
else
    echo "Warning: memanagement-api.service not found in ./deployment/"
    echo "Please copy it manually to /etc/systemd/system/"
fi

echo ""
echo "Step 5: Configuring Apache virtual host..."

# Create Apache configuration from template
if [ -f "./deployment/apache-memanagement.conf" ]; then
    cp ./deployment/apache-memanagement.conf /etc/apache2/sites-available/
    
    # Update ServerName in the configuration
    sed -i "s/ServerName memanagement.local/ServerName $SERVER_NAME/g" /etc/apache2/sites-available/apache-memanagement.conf
    
    # Enable the site
    a2ensite apache-memanagement.conf
    
    # Optionally disable default site
    read -p "Disable default Apache site? (y/n): " DISABLE_DEFAULT
    if [ "$DISABLE_DEFAULT" = "y" ]; then
        a2dissite 000-default.conf
    fi
    
    # Test configuration
    apache2ctl configtest
    
    # Reload Apache
    systemctl reload apache2
    
    echo "Apache configured for $SERVER_NAME"
else
    echo "Warning: apache-memanagement.conf not found in ./deployment/"
    echo "Please copy and configure it manually"
fi

echo ""
echo "Step 6: Configuring firewall..."
ufw allow 'Apache Full'
ufw --force enable

echo ""
echo "=========================================="
echo "Server Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Set up GitHub Actions self-hosted runner on this server"
echo "2. Configure runner with sudo permissions (see DEPLOYMENT.md)"
echo "3. Update appsettings.Production.json with your server details"
echo "4. Push to main branch to trigger automatic deployment"
echo ""
echo "Access your application at: http://$SERVER_NAME"
echo ""
