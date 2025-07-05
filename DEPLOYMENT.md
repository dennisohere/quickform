# QuickForm Deployment Guide

This guide explains how to set up automated deployment of the QuickForm application to your VPS using GitHub Actions and Docker Compose.

## Prerequisites

### VPS Requirements

- Ubuntu 20.04+ or similar Linux distribution
- Docker and Docker Compose installed
- Git installed
- SSH access configured
- Domain name pointing to your VPS (for SSL)

### GitHub Repository Setup

- Repository with `staging` and `main` branches
- GitHub Actions enabled

## VPS Setup

### 1. Install Docker and Docker Compose

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout and login again for group changes to take effect
```

### 2. Create Application Directory

```bash
# Create directory for the application
mkdir -p /var/www/quickform
cd /var/www/quickform

# Clone the repository
git clone https://github.com/yourusername/quickform.git .
```

### 3. Generate SSH Key for GitHub Actions

```bash
# Generate SSH key pair
ssh-keygen -t rsa -b 4096 -C "github-actions@yourdomain.com" -f ~/.ssh/github_actions

# Add public key to authorized_keys
cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys

# Set proper permissions
chmod 600 ~/.ssh/github_actions
chmod 644 ~/.ssh/github_actions.pub
```

### 4. Configure Environment

```bash
# Copy environment file
cp .env.example .env

# Edit environment file with your settings
nano .env
```

Required environment variables:

```env
APP_NAME=QuickForm
APP_ENV=production
APP_KEY=base64:your-app-key-here
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=quickform_prod
DB_USERNAME=quickform_user
DB_PASSWORD=your-secure-password

REDIS_HOST=redis
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=your-smtp-host
MAIL_PORT=587
MAIL_USERNAME=your-email
MAIL_PASSWORD=your-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@yourdomain.com
MAIL_FROM_NAME="${APP_NAME}"
```

### 5. Setup SSL Certificates

```bash
# Create SSL directory
mkdir -p ssl

# For Let's Encrypt (recommended)
sudo apt install certbot
sudo certbot certonly --standalone -d yourdomain.com

# Copy certificates to the ssl directory
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ssl/key.pem

# Set proper permissions
sudo chown -R $USER:$USER ssl/
chmod 600 ssl/*
```

## GitHub Repository Setup

### 1. Add Repository Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions, and add the following secrets:

- `VPS_SSH_PRIVATE_KEY`: The private SSH key content (from `~/.ssh/github_actions`)
- `VPS_HOST`: Your VPS IP address or domain
- `VPS_USER`: Your VPS username
- `VPS_PATH`: Path to your application directory (e.g., `/var/www/quickform`)
- `VPS_URL`: Your application URL (e.g., `https://yourdomain.com`)

### 2. Create Branches

```bash
# Create staging branch
git checkout -b staging
git push -u origin staging

# Ensure main branch exists
git checkout main
git push -u origin main
```

## Deployment Workflows

### Automatic Deployment

The application will automatically deploy when you push to specific branches:

- **Staging**: Push to `staging` branch → deploys to staging environment
- **Production**: Push to `main` branch → deploys to production environment

### Manual Deployment

You can also trigger deployments manually:

1. Go to your GitHub repository
2. Click on "Actions" tab
3. Select the deployment workflow
4. Click "Run workflow"

### Manual VPS Deployment

If you need to deploy manually on the VPS:

```bash
# For staging
./deploy.sh staging

# For production
./deploy.sh production
```

## Monitoring and Maintenance

### Health Checks

The application includes a health check endpoint at `/health` that returns a simple "healthy" response.

### Logs

View application logs:

```bash
# All services
docker-compose -f docker-compose.prod.yml logs

# Specific service
docker-compose -f docker-compose.prod.yml logs app

# Follow logs in real-time
docker-compose -f docker-compose.prod.yml logs -f
```

### Database Backups

Create a backup script:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker-compose -f docker-compose.prod.yml exec -T db mysqldump -u quickform_user -pquickform_password quickform_prod > backup_$DATE.sql
```

### SSL Certificate Renewal

Set up automatic SSL renewal:

```bash
# Add to crontab
0 12 * * * /usr/bin/certbot renew --quiet && cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem /var/www/quickform/ssl/cert.pem && cp /etc/letsencrypt/live/yourdomain.com/privkey.pem /var/www/quickform/ssl/key.pem && docker-compose -f /var/www/quickform/docker-compose.prod.yml restart nginx
```

## Troubleshooting

### Common Issues

1. **Permission Denied**: Ensure proper file permissions

    ```bash
    sudo chown -R $USER:$USER /var/www/quickform
    chmod +x deploy.sh
    ```

2. **Database Connection Issues**: Check if database container is running

    ```bash
    docker-compose -f docker-compose.prod.yml ps
    ```

3. **SSL Issues**: Verify certificate paths and permissions

    ```bash
    ls -la ssl/
    ```

4. **Port Conflicts**: Check if ports 80/443 are available
    ```bash
    sudo netstat -tlnp | grep :80
    sudo netstat -tlnp | grep :443
    ```

### Rollback

To rollback to a previous version:

```bash
# Check git log
git log --oneline

# Reset to previous commit
git reset --hard HEAD~1

# Redeploy
./deploy.sh production
```

## Security Considerations

1. **Firewall**: Configure UFW to only allow necessary ports
2. **SSH**: Use key-based authentication and disable password login
3. **Environment Variables**: Never commit sensitive data to version control
4. **Regular Updates**: Keep Docker images and system packages updated
5. **Backups**: Implement regular database and file backups

## Support

For issues with deployment:

1. Check the GitHub Actions logs
2. Review VPS logs: `docker-compose logs`
3. Verify environment configuration
4. Ensure all prerequisites are met
