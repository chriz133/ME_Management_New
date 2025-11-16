# Quick Start Guide - Deployment Setup

This is a simplified guide to get you started quickly. For complete details, see [DEPLOYMENT.md](DEPLOYMENT.md).

## Prerequisites
- Linux server (Ubuntu 20.04+ or Debian 11+) in your local network
- Server accessible from where you'll run GitHub Actions
- Basic Linux command line knowledge

## Step-by-Step Setup

### 1️⃣ Prepare Your Server (10 minutes)

```bash
# SSH to your Linux server
ssh your-user@your-server-ip

# Clone this repository
git clone https://github.com/chriz133/ME_Management_New.git
cd ME_Management_New

# Run the setup script (will install Apache, .NET, configure services)
sudo ./deployment/setup-server.sh

# When prompted, enter your server's IP or hostname
# Example: 192.168.0.100 or memanagement.local
```

### 2️⃣ Configure GitHub Self-Hosted Runner (5 minutes)

```bash
# On your server, create runner directory
mkdir ~/actions-runner && cd ~/actions-runner

# Go to GitHub repository in browser:
# Settings → Actions → Runners → New self-hosted runner

# Follow the instructions shown on GitHub to:
# 1. Download the runner
# 2. Configure it (copy the token from GitHub)
# 3. Install as service

# Example commands (use the actual token from GitHub):
curl -o actions-runner-linux-x64-2.311.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-linux-x64-2.311.0.tar.gz
tar xzf ./actions-runner-linux-x64-2.311.0.tar.gz
./config.sh --url https://github.com/chriz133/ME_Management_New --token YOUR_TOKEN_HERE
sudo ./svc.sh install
sudo ./svc.sh start
```

### 3️⃣ Grant Runner Permissions (2 minutes)

```bash
# Replace 'runner-user' with your actual runner username
# You can find it by running: whoami (in the actions-runner directory)

sudo nano /etc/sudoers.d/github-runner

# Add these lines (replace runner-user with actual username):
```

```
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

Save and exit (Ctrl+X, Y, Enter)

### 4️⃣ Update Configuration Files (3 minutes)

Edit production configuration with your server's IP/hostname:

```bash
# Edit the production settings
nano server/Server.Api/appsettings.Production.json
```

Update the CORS origins:
```json
{
  "Cors": {
    "AllowedOrigins": [
      "http://localhost",
      "http://YOUR_SERVER_IP",      ← Change this
      "http://YOUR_HOSTNAME"         ← Change this
    ]
  }
}
```

Commit the change:
```bash
git add server/Server.Api/appsettings.Production.json
git commit -m "Update production CORS settings"
git push
```

### 5️⃣ Deploy! (Automatic)

```bash
# Simply merge this PR or push to main branch
# The GitHub Actions workflow will automatically:
# ✅ Build the .NET API
# ✅ Build the Angular app
# ✅ Deploy both to your server
# ✅ Restart services

# Watch the deployment progress in GitHub:
# Actions tab → Deploy to Apache Server workflow
```

### 6️⃣ Access Your Application

Open your browser and go to:
```
http://YOUR_SERVER_IP
```

You should see the ME Management application!

## Troubleshooting

### Runner not starting?
```bash
sudo ./svc.sh status
sudo journalctl -u actions.runner.* -f
```

### Deployment failed?
Check the GitHub Actions logs in the repository's Actions tab.

### Application not loading?
```bash
# Check API service
sudo systemctl status memanagement-api
sudo journalctl -u memanagement-api -f

# Check Apache
sudo systemctl status apache2
sudo tail -f /var/log/apache2/memanagement_error.log
```

### Permission errors?
Make sure you added the runner user to sudoers (Step 3).

## What Happens on Every Push to Main?

1. ⚡ GitHub Actions detects push
2. 🏗️ Builds .NET API and Angular app
3. 💾 Creates backup of current deployment
4. 🚀 Deploys new version
5. 🔄 Restarts services
6. ✅ Application updated!

## Security Notes

After initial setup:
- ⚠️ Change the JWT secret in `appsettings.Production.json`
- 🔒 Set up HTTPS (see `deployment/apache-memanagement.conf` for template)
- 🛡️ Configure firewall to only allow necessary ports
- 🔐 Use strong database passwords

## Need Help?

- 📖 Full documentation: [DEPLOYMENT.md](DEPLOYMENT.md)
- 📋 Implementation details: [DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md)
- 🐛 Check logs as shown in Troubleshooting section above

## Next Level

Once basic deployment works:
- Set up HTTPS with Let's Encrypt
- Configure automated backups
- Set up monitoring/alerting
- Add staging environment

---

**Estimated Setup Time**: 20-30 minutes

**Difficulty**: Medium (requires basic Linux knowledge)

**Result**: Automatic deployment whenever you push to main! 🎉
