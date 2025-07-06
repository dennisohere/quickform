# Deployment Guide

This guide explains how to deploy QuickForm using GitHub Actions with SSL support.

## Overview

The deployment system uses GitHub Actions workflows that can be triggered automatically on branch pushes or manually through the GitHub Actions UI. SSL certificates are automatically managed using Let's Encrypt and Certbot.

## Environment Variables Setup

Instead of using workflow inputs, the deployment now uses **GitHub Environment Variables** for better security and consistency.

### Required Environment Variables

Set these variables in your GitHub repository:

1. Go to your repository **Settings**
2. Navigate to **Secrets and variables** → **Actions**
3. Click on **Variables** tab
4. Add the following variables:

#### For Production Environment:

- `SSL_DOMAIN`: Your production domain (e.g., `myapp.com`)
- `SSL_EMAIL`: Email for SSL notifications (e.g., `admin@myapp.com`)
- `SSL_SUBDOMAINS`: Comma-separated subdomains (default: `www,api`)
- `APP_ENV`: Application environment variables

#### For Sandbox Environment:

- `SSL_DOMAIN`: Your sandbox domain (e.g., `sandbox.myapp.com`)
- `SSL_EMAIL`: Email for SSL notifications (e.g., `admin@myapp.com`)
- `SSL_SUBDOMAINS`: Comma-separated subdomains (default: `www,api`)
- `APP_ENV`: Application environment variables

### Required Secrets

Set these secrets in your GitHub repository:

1. Go to your repository **Settings**
2. Navigate to **Secrets and variables** → **Actions**
3. Click on **Secrets** tab
4. Add the following secrets:

- `VPS_SSH_PRIVATE_KEY`: SSH private key for server access
- `VPS_HOST`: Your VPS hostname or IP address
- `VPS_USER`: SSH username for server access
- `VPS_PATH`: Path to your application on the server
- `VPS_URL`: Base URL for health checks (fallback when SSL is not configured)

## Deployment Workflows

### 1. Production Deployment (`deploy-with-ssl.yml`)

**Triggers:**

- Automatic: Push to `production` branch
- Manual: Workflow dispatch with environment selection

**Features:**

- SSL certificate management
- Automatic SSL renewal
- Health checks
- SSL certificate verification

**Usage:**

```bash
# Automatic deployment
git push origin production

# Manual deployment
# Go to Actions → Deploy with SSL → Run workflow
# Select environment: production or staging
```

### 2. Sandbox Deployment (`deploy-sandbox.yml`)

**Triggers:**

- Automatic: Push to `sandbox` branch
- Manual: Workflow dispatch

**Features:**

- SSL certificate management (default enabled)
- Automatic SSL renewal
- Health checks
- SSL certificate verification

**Usage:**

```bash
# Automatic deployment
git push origin sandbox

# Manual deployment
# Go to Actions → Deploy to Sandbox → Run workflow
```

## SSL Configuration

### Automatic SSL Setup

When `SSL_DOMAIN` and `SSL_EMAIL` environment variables are set:

1. **Certificate Generation**: Certbot automatically generates SSL certificates
2. **Auto-Renewal**: Certificates are renewed automatically via cron job
3. **Nginx Configuration**: Uses SSL-enabled nginx configuration
4. **Health Checks**: Uses HTTPS for health checks

### SSL Certificate Renewal

SSL certificates are automatically renewed twice daily (at 00:00 and 12:00) using a cron job that:

1. Runs `certbot renew` in the certbot container
2. Reloads nginx if certificates were renewed
3. Logs renewal status to `/var/log/ssl-renewal.log`

## Deployment Process

1. **Code Checkout**: Latest code is pulled from the specified branch
2. **Environment Setup**: `.env` file is generated with SSL configuration
3. **Docker Build**: Containers are built with the latest code
4. **Database Migration**: Laravel migrations are run
5. **Cache Optimization**: Application caches are cleared and rebuilt
6. **SSL Setup**: SSL certificates are configured (if enabled)
7. **Health Check**: Application health is verified
8. **SSL Verification**: SSL certificate validity is checked

## Troubleshooting

### SSL Certificate Issues

If SSL certificate generation fails:

1. Check that `SSL_DOMAIN` and `SSL_EMAIL` are set correctly
2. Verify DNS is pointing to your server
3. Ensure ports 80 and 443 are open
4. Check Certbot logs: `docker-compose logs certbot`

### Deployment Failures

If deployment fails:

1. Check GitHub Actions logs for specific error messages
2. Verify all required secrets and variables are set
3. Ensure SSH access to the server is working
4. Check server disk space and Docker status

### Health Check Failures

If health checks fail:

1. Verify the application is running: `docker-compose ps`
2. Check application logs: `docker-compose logs app`
3. Verify database connectivity
4. Check nginx configuration and logs

## Manual SSL Renewal

To manually renew SSL certificates:

```bash
# SSH into your server
ssh user@your-server

# Navigate to your application directory
cd /path/to/your/app

# Run SSL renewal
docker-compose -f docker-compose.ssl.yml exec certbot certbot renew

# Reload nginx
docker-compose -f docker-compose.ssl.yml exec nginx nginx -s reload
```

## Security Considerations

1. **Environment Variables**: Use GitHub environment variables instead of secrets for non-sensitive configuration
2. **SSL Certificates**: Let's Encrypt certificates are automatically managed and renewed
3. **SSH Keys**: Use SSH key-based authentication for server access
4. **Docker Security**: Containers run with minimal privileges
5. **Nginx Security**: SSL configuration includes security headers and best practices

## Monitoring

Monitor your deployment:

1. **GitHub Actions**: Check workflow status and logs
2. **Server Logs**: Monitor application and nginx logs
3. **SSL Certificates**: Check certificate expiration dates
4. **Health Endpoints**: Monitor `/health` endpoint availability

## Support

For deployment issues:

1. Check the GitHub Actions logs for detailed error messages
2. Verify all environment variables and secrets are correctly set
3. Ensure your server meets the minimum requirements
4. Review the troubleshooting section above

## File Structure

```
quickform/
├── .github/workflows/
│   ├── deploy-with-ssl.yml      # Production deployment with SSL
│   └── deploy-sandbox.yml       # Sandbox deployment with optional SSL
├── docker-compose.yml           # Standard Docker configuration
├── docker-compose.ssl.yml       # SSL-enabled Docker configuration
├── renew-ssl-sandbox.sh         # Sandbox SSL renewal script
├── DEPLOYMENT.md                # This comprehensive guide
└── README.md                    # Project overview
```
