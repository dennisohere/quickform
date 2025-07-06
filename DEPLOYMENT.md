# QuickForm Deployment Guide

This guide covers deployment of the QuickForm application using GitHub Actions with optional SSL certificate support.

## Overview

The QuickForm application uses automated GitHub Actions workflows for deployment with integrated SSL certificate management via Let's Encrypt and Certbot.

## Deployment Options

### 1. Production Deployment (`deploy-with-ssl.yml`)

- Deploys from `main` branch
- Supports automatic SSL certificate installation
- Uses `docker-compose.ssl.yml` for SSL-enabled deployments
- Includes comprehensive health checks and SSL verification

### 2. Sandbox Deployment (`deploy-sandbox.yml`)

- Deploys from `sandbox` branch
- Optional SSL support for testing
- Uses separate project namespace (`quickform_sandbox`)
- Perfect for testing SSL configurations before production

## Prerequisites

### Domain Configuration

- Ensure your domain points to your VPS IP address
- Configure DNS records for main domain and subdomains
- Allow time for DNS propagation (up to 48 hours)

### VPS Requirements

- Ubuntu 20.04+ or similar Linux distribution
- Docker and Docker Compose installed
- Git installed
- SSH access configured
- Domain name pointing to your VPS (for SSL)

### GitHub Repository Setup

#### Required Secrets

Configure these secrets in your GitHub repository settings:

```
VPS_SSH_PRIVATE_KEY    # SSH private key for VPS access
VPS_HOST               # VPS hostname or IP address
VPS_USER               # SSH username
VPS_PATH               # Project path on VPS (e.g., /var/www/quickform)
VPS_URL                # Base URL for health checks (without SSL)
```

#### Required Variables

Configure these variables in your GitHub repository settings:

```
APP_ENV                # Application environment configuration
```

## Usage

### Automatic Production Deployment

Push to the `main` branch to trigger automatic deployment:

```bash
git push origin main
```

### Manual Production Deployment with SSL

1. Go to GitHub repository → Actions → Deploy with SSL
2. Click "Run workflow"
3. Fill in the required parameters:
    - **SSL Domain**: Your domain (e.g., `example.com`)
    - **SSL Email**: Email for SSL notifications
    - **SSL Subdomains**: Comma-separated subdomains (default: `www,api`)

### Sandbox Deployment

#### Automatic (No SSL)

```bash
git push origin sandbox
```

#### Manual with SSL

1. Go to GitHub repository → Actions → Deploy to Sandbox
2. Click "Run workflow"
3. Fill in optional SSL parameters:
    - **SSL Domain**: Your sandbox domain (e.g., `sandbox.example.com`)
    - **SSL Email**: Email for SSL notifications
    - **SSL Subdomains**: Comma-separated subdomains

## SSL Configuration

### Certificate Types

- **Domain Certificate**: Covers main domain and specified subdomains
- **Let's Encrypt**: Free, automated certificates with 90-day validity

### Auto-Renewal

- Certificates are automatically renewed twice daily (00:00 and 12:00)
- Renewal logs are stored in `/var/log/ssl-renewal-[environment].log`
- Failed renewals are logged for troubleshooting

### SSL Files Location

- Certificates: `/etc/letsencrypt/live/[domain]/`
- Private keys: `/etc/letsencrypt/archive/[domain]/`
- Renewal config: `/etc/letsencrypt/renewal/[domain].conf`

## Docker Configuration

### SSL-Enabled Compose File (`docker-compose.ssl.yml`)

Includes:

- Nginx with SSL configuration
- Certbot for certificate management
- Volume mounts for SSL certificates
- Proper port mappings (80, 443)

### Container Services

- `app`: Laravel application
- `nginx`: Web server with SSL
- `certbot`: SSL certificate management
- `db`: Database (if configured)

## Health Checks

### HTTP Health Check

```bash
curl -f http://your-domain/health
```

### HTTPS Health Check (SSL enabled)

```bash
curl -f -k https://your-domain/health
```

### SSL Certificate Verification

```bash
openssl s_client -servername your-domain -connect your-domain:443
```

## Troubleshooting

### Common Issues

1. **SSL Certificate Not Issued**

    - Check domain DNS configuration
    - Verify domain points to VPS IP
    - Check firewall settings (ports 80, 443)
    - Ensure ports are open: `sudo ufw allow 80 && sudo ufw allow 443`

2. **Auto-Renewal Fails**

    - Check renewal logs: `tail -f /var/log/ssl-renewal-[environment].log`
    - Verify cron job: `crontab -l`
    - Test renewal manually: `/usr/local/bin/renew-ssl-[environment].sh`

3. **Container Issues**
    - Check container status: `docker-compose -p quickform ps`
    - View logs: `docker-compose -p quickform logs [service]`
    - Restart services: `docker-compose -p quickform restart`

### Debug Commands

```bash
# Check SSL certificate status
docker-compose -p quickform exec certbot certbot certificates

# Test nginx configuration
docker-compose -p quickform exec nginx nginx -t

# Check SSL renewal script
cat /usr/local/bin/renew-ssl.sh

# View cron jobs
crontab -l

# Check SSL logs
tail -f /var/log/ssl-renewal.log

# Check container health
docker-compose -p quickform ps
docker-compose -p quickform logs --tail=50
```

## Security Considerations

1. **Certificate Security**

    - Private keys are stored securely in `/etc/letsencrypt/archive/`
    - Certificates are automatically renewed before expiration
    - Failed renewals are logged for monitoring

2. **Access Control**

    - SSL renewal scripts are executable only by root
    - Cron jobs run with appropriate permissions
    - Docker containers run with limited privileges

3. **Monitoring**
    - Health checks verify application and SSL status
    - Renewal logs track certificate management
    - GitHub Actions provide deployment status

## Rollback Procedures

### From SSL to HTTP-only

1. Run workflow manually without SSL parameters
2. The workflow will automatically switch to `docker-compose.yml`
3. SSL certificates will remain but won't be used
4. Remove SSL cron job manually if needed

### Emergency Rollback

```bash
# Stop SSL containers
docker-compose -p quickform down

# Start standard containers
docker-compose -p quickform up -d

# Remove SSL cron job
crontab -l | grep -v "renew-ssl" | crontab -
```

## Best Practices

1. **Domain Management**

    - Use dedicated subdomain for sandbox (e.g., `sandbox.example.com`)
    - Configure DNS records properly
    - Monitor certificate expiration

2. **Deployment**

    - Test SSL setup in sandbox before production
    - Monitor deployment logs for issues
    - Verify health checks after deployment

3. **Maintenance**
    - Regularly check renewal logs
    - Monitor certificate expiration dates
    - Keep SSL renewal scripts updated

## Monitoring and Alerts

### Health Check Endpoints

- Production: `https://your-domain/health`
- Sandbox: `https://sandbox.your-domain/health`

### Log Locations

- Application logs: `docker-compose logs app`
- Nginx logs: `docker-compose logs nginx`
- SSL renewal logs: `/var/log/ssl-renewal-[environment].log`

### GitHub Actions

- Monitor workflow runs in GitHub Actions tab
- Check for failed deployments and SSL setup issues
- Review logs for troubleshooting

## Support

For deployment issues:

1. Check GitHub Actions logs first
2. Review server logs and renewal logs
3. Verify DNS and network configuration
4. Test SSL setup manually if needed
5. Check container health and status

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
