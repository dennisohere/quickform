# QuickForm Deployment Guide

This is the **official deployment solution** for QuickForm using Docker, Nginx, and SSL certificates.

## 🚀 Quick Start

### 1. Configure Your Project

The deployment files are already included in this project:

```bash
# Core deployment files
docker-compose.yml
deploy.sh
.env.example
ssl-setup.sh
nginx-ssl.conf

# Make deployment script executable
chmod +x deploy.sh
```

### 2. Configure Your Project

Edit the configuration variables at the top of `deploy.sh`:

```bash
# VPS Configuration
VPS_HOST="192.3.24.5"
VPS_USER="root"
VPS_PATH="/var/projects/quickform/sandbox"

# Project Configuration
PROJECT_NAME="quickform"
DEPLOY_ENV="sandbox"
PROJECT_PORT="8080"

# SSL Configuration (optional)
SSL_DOMAIN="yourdomain.com"
SSL_EMAIL="admin@yourdomain.com"

# Database Configuration
DB_DATABASE="quickform_db"
DB_USERNAME="postgres"
DB_PASSWORD="your_secure_password"
```

### 3. Set Up Your .env File

Copy `.env.example` to `.env` and customize:

```bash
cp .env.example .env
# Edit .env with your project-specific values
```

### 4. Deploy!

```bash
./deploy.sh
```

## 📋 Configuration Options

### Environment Variables

You can override any configuration by setting environment variables:

```bash
# Deploy with custom settings
PROJECT_NAME="quickform" \
PROJECT_PORT="9090" \
SSL_DOMAIN="quickform.com" \
./deploy.sh

# Force rebuild
FORCE_REBUILD=true ./deploy.sh

# Clear project volumes (safe - only affects this project)
CLEAR_VOLUMES=true ./deploy.sh

# Seed database with sample data
SEED_DATA=true ./deploy.sh
```

### GitHub Variables (Recommended)

For automated deployments, set these in GitHub repository variables:

| Variable        | Description                    | Example                           |
| --------------- | ------------------------------ | --------------------------------- |
| `PROJECT_NAME`  | Project name                   | `quickform`                       |
| `PROJECT_PORT`  | HTTP port                      | `8080`                            |
| `FORCE_REBUILD` | Force rebuild containers       | `true`                            |
| `CLEAR_VOLUMES` | Clear project volumes          | `false`                           |
| `SEED_DATA`     | Seed database with sample data | `false`                           |
| `VPS_HOST`      | VPS IP address                 | `192.3.24.5`                      |
| `VPS_USER`      | SSH user                       | `root`                            |
| `VPS_PATH`      | Project path                   | `/var/projects/quickform/sandbox` |
| `SSL_DOMAIN`    | Domain name                    | `quickform.example.com`           |
| `SSL_EMAIL`     | SSL email                      | `admin@example.com`               |
| `DB_DATABASE`   | Database name                  | `quickform_db`                    |
| `DB_USERNAME`   | Database user                  | `postgres`                        |
| `DB_PASSWORD`   | Database password              | `your_secure_password`            |

**Variable Priority**: Manual input → GitHub Variables → Default values

See [GITHUB_VARIABLES.md](GITHUB_VARIABLES.md) for complete setup instructions.

### Port Management

Each project gets its own ports:

- **HTTP**: `PROJECT_PORT` (default: 8080)
- **HTTPS**: `PROJECT_PORT + 1` (default: 8081)

Examples:

- Project A: Ports 8080/8081
- Project B: Ports 8082/8083
- Project C: Ports 8084/8085

### SSL Configuration

**With SSL:**

```bash
SSL_DOMAIN="myapp.com"
SSL_EMAIL="admin@myapp.com"
```

**Without SSL:**

```bash
SSL_DOMAIN=""
SSL_EMAIL=""
```

## 🔧 Multi-Project Setup

### Option 1: Different Ports (Recommended)

Each project runs on different ports - no conflicts:

```bash
# QuickForm (Main)
PROJECT_NAME="quickform"
PROJECT_PORT="8080"

# QuickForm (Staging)
PROJECT_NAME="quickform-staging"
PROJECT_PORT="8082"

# QuickForm (Testing)
PROJECT_NAME="quickform-test"
PROJECT_PORT="8084"
```

### Option 2: Reverse Proxy (Advanced)

For production with domain routing, use a reverse proxy setup.

## 📁 Project Structure

Your VPS will have this structure:

```
/var/projects/
├── quickform/
│   ├── sandbox/
│   └── production/
├── quickform-staging/
│   ├── sandbox/
│   └── production/
└── quickform-test/
    ├── sandbox/
    └── production/
```

## 🔍 Troubleshooting

### Common Issues

**1. Port Already in Use**

```bash
# Check what's using the port
ssh root@your-vps "netstat -tlnp | grep :8080"

# Use a different port
PROJECT_PORT="8082" ./deploy.sh
```

**2. Database Connection Issues**

```bash
# Check what volumes would be affected
./list-volumes.sh

# Clear project volumes and redeploy (safe - only affects this project)
CLEAR_VOLUMES=true ./deploy.sh
```

**3. SSL Certificate Issues**

```bash
# Check SSL setup
ssh root@your-vps "cd /var/projects/quickform/sandbox && ./ssl-setup.sh certbot"

# Regenerate certificates
ssh root@your-vps "cd /var/projects/quickform/sandbox && docker-compose -f docker-compose.yml -p quickform_sandbox exec certbot certbot renew --force-renewal"
```

**4. Container Restart Loops**

```bash
# Check logs
ssh root@your-vps "cd /var/projects/quickform/sandbox && docker-compose -f docker-compose.yml -p quickform_sandbox logs"

# Force rebuild
FORCE_REBUILD=true ./deploy.sh
```

### Useful Commands

```bash
# View all running projects
ssh root@your-vps "docker ps --format 'table {{.Names}}\t{{.Ports}}\t{{.Status}}'"

# View specific project logs
ssh root@your-vps "cd /var/projects/quickform/sandbox && docker-compose -f docker-compose.yml -p quickform_sandbox logs -f"

# Stop a project
ssh root@your-vps "cd /var/projects/quickform/sandbox && docker-compose -f docker-compose.yml -p quickform_sandbox down"

# Access project shell
ssh root@your-vps "cd /var/projects/quickform/sandbox && docker-compose -f docker-compose.yml -p quickform_sandbox exec app bash"

# Check what volumes would be affected by CLEAR_VOLUMES
./list-volumes.sh
```

## 🔒 Security Considerations

### Database Passwords

- Use strong, unique passwords for each project
- Never commit `.env` files to version control
- Consider using Docker secrets for production

### SSL Certificates

- Certificates auto-renew via cron job
- Check renewal logs: `/var/log/ssl-renewal-PROJECT_NAME.log`
- Monitor certificate expiration

### Firewall

- Ensure ports 80/443 are open for SSL
- Consider using a reverse proxy for better security

## 📊 Monitoring

### Health Checks

```bash
# Check all projects
for project in /var/projects/*/sandbox; do
  echo "Checking $(basename $(dirname $(dirname $project)))"
  cd $project && docker-compose ps
done
```

### Resource Usage

```bash
# Monitor resource usage
ssh root@your-vps "docker stats --no-stream"
```

### Log Monitoring

```bash
# Monitor all project logs
ssh root@your-vps "tail -f /var/log/ssl-renewal-*.log"
```

## 🚀 Production Checklist

Before deploying to production:

- [ ] Set `APP_ENV=production` in `.env`
- [ ] Set `APP_DEBUG=false` in `.env`
- [ ] Generate strong `APP_KEY`
- [ ] Configure proper mail settings
- [ ] Set up monitoring/logging
- [ ] Configure backups
- [ ] Test SSL certificate renewal
- [ ] Set up proper firewall rules

## 📝 Example: Deploying QuickForm

Here's a complete example of deploying QuickForm:

### 1. Configure

```bash
# Edit deploy.sh
VPS_HOST="192.3.24.5"
VPS_USER="root"
VPS_PATH="/var/projects/quickform/sandbox"
PROJECT_NAME="quickform"
PROJECT_PORT="8080"
SSL_DOMAIN="quickform.example.com"
SSL_EMAIL="admin@example.com"

# Set up .env
cp .env.example .env
# Edit .env with QuickForm-specific values
```

### 2. Deploy

```bash
chmod +x deploy.sh
./deploy.sh
```

### 3. Access

- HTTP: http://192.3.24.5:8080
- HTTPS: https://192.3.24.5:8081
- Domain: https://quickform.example.com

## 🎉 That's It!

Your QuickForm deployment solution is ready! The project now includes:

- ✅ **Docker-based** deployment with Nginx
- ✅ **Automatic SSL** certificate generation and renewal
- ✅ **Database** setup and migrations
- ✅ **Multi-environment** support (sandbox, staging, production)
- ✅ **Health monitoring** and logging
- ✅ **Zero-downtime** deployments

### Quick Commands

```bash
# Deploy to sandbox
./deploy.sh

# Deploy with force rebuild
FORCE_REBUILD=true ./deploy.sh

# Deploy to different port
PROJECT_PORT="8082" ./deploy.sh

# Clear project volumes and redeploy
CLEAR_VOLUMES=true ./deploy.sh
```

### GitHub Actions Workflow

The project includes a GitHub Actions workflow for automated deployment:

- **Automatic**: Push to `main`, `staging`, or `sandbox` branches
- **Manual**: Trigger workflow with custom settings
- **Environment-specific**: Different ports and configurations per environment

See [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) for the workflow configuration.

The solution handles everything automatically - just configure and deploy! 🚀
