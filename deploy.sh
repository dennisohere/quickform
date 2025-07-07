#!/bin/bash
# Universal Deployment Script
# Copy this to any Laravel project and it will work with minimal configuration

set -e

# =============================================================================
# CONFIGURATION - Variables can be set via GitHub Actions or environment
# =============================================================================

# VPS Configuration
VPS_HOST="${VPS_HOST:-}"
VPS_USER="${VPS_USER:-}"
VPS_PATH="${VPS_PATH:-}"

# Project Configuration (GitHub Variables: PROJECT_NAME, PROJECT_PORT)
PROJECT_NAME="${PROJECT_NAME:-quickform}"
DEPLOY_ENV="${DEPLOY_ENV:-sandbox}"
PROJECT_PORT="${PROJECT_PORT:-8080}"

# SSL Configuration (optional)
SSL_DOMAIN="${SSL_DOMAIN:-}"
SSL_EMAIL="${SSL_EMAIL:-}"
SSL_SUBDOMAINS="${SSL_SUBDOMAINS:-www,api}"


# Deployment Options (GitHub Variables: FORCE_REBUILD, CLEAR_VOLUMES)
FORCE_REBUILD="${FORCE_REBUILD:-false}"
CLEAR_VOLUMES="${CLEAR_VOLUMES:-false}"

# =============================================================================
# SCRIPT LOGIC - Don't edit below this line
# =============================================================================

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 QuickForm Deployment Script${NC}"
echo -e "${YELLOW}Project: $PROJECT_NAME${NC}"
echo -e "${YELLOW}Environment: $DEPLOY_ENV${NC}"
echo -e "${YELLOW}Port: $PROJECT_PORT${NC}"

# Show which variables are set from GitHub
echo ""
echo -e "${BLUE}🔧 Configuration Sources:${NC}"
if [ -n "$GITHUB_ACTIONS" ]; then
  echo -e "${GREEN}✅ Running in GitHub Actions${NC}"
  echo "  GitHub Variables:"
  [ -n "$PROJECT_NAME" ] && echo "    PROJECT_NAME: $PROJECT_NAME"
  [ -n "$PROJECT_PORT" ] && echo "    PROJECT_PORT: $PROJECT_PORT"
  [ -n "$FORCE_REBUILD" ] && echo "    FORCE_REBUILD: $FORCE_REBUILD"
  [ -n "$CLEAR_VOLUMES" ] && echo "    CLEAR_VOLUMES: $CLEAR_VOLUMES"
else
  echo -e "${YELLOW}⚠️  Running locally - using default values${NC}"
fi
echo ""

# Validate configuration
if [ -z "$VPS_HOST" ] || [ -z "$VPS_USER" ] || [ -z "$VPS_PATH" ]; then
    echo -e "${RED}❌ Error: VPS_HOST, VPS_USER, and VPS_PATH must be set${NC}"
    exit 1
fi

# Set derived variables
NGINX_PORT_80=$PROJECT_PORT
NGINX_PORT_443=$((PROJECT_PORT + 1))
COMPOSE_PROJECT_NAME="${PROJECT_NAME}_${DEPLOY_ENV}"

echo -e "${BLUE}📋 Deployment Configuration:${NC}"
echo "  VPS: $VPS_USER@$VPS_HOST:$VPS_PATH"
echo "  Project: $PROJECT_NAME"
echo "  Environment: $DEPLOY_ENV"
echo "  HTTP Port: $NGINX_PORT_80"
echo "  HTTPS Port: $NGINX_PORT_443"
echo "  Database: $DB_DATABASE"
echo ""

# Use the main compose file
COMPOSE_FILE="docker-compose.yml"
if [ -n "$SSL_DOMAIN" ] && [ -n "$SSL_EMAIL" ]; then
  echo -e "${GREEN}✅ Using SSL-enabled configuration for $SSL_DOMAIN${NC}"
else
  echo -e "${YELLOW}⚠️  Using standard configuration (no SSL)${NC}"
fi

# Pull latest changes
echo -e "${BLUE}📥 Pulling latest changes...${NC}"
ssh $VPS_USER@$VPS_HOST "cd $VPS_PATH && git fetch origin && git reset --hard origin/$DEPLOY_ENV"

# Make SSL setup script executable if it exists
ssh $VPS_USER@$VPS_HOST "cd $VPS_PATH && chmod +x ssl-setup.sh" 2>/dev/null || echo "SSL setup script not found (this is OK)"

# Stop existing containers
echo -e "${BLUE}🛑 Stopping existing containers...${NC}"
ssh $VPS_USER@$VPS_HOST "cd $VPS_PATH && docker-compose -f $COMPOSE_FILE -p $COMPOSE_PROJECT_NAME down"

# Handle volume cache issues
if [ "$CLEAR_VOLUMES" = "true" ]; then
  echo -e "${YELLOW}🗑️ Clearing project volumes to resolve cache issues...${NC}"

  # Stop containers and remove project-specific volumes
  ssh $VPS_USER@$VPS_HOST "cd $VPS_PATH && docker-compose -f $COMPOSE_FILE -p $COMPOSE_PROJECT_NAME down -v"

  # Remove only volumes specific to this project
  # Docker Compose creates volumes with pattern: PROJECT_NAME_ENV_volumename
  # Example: quickform_sandbox_code_base, quickform_sandbox_db_data, etc.
  ssh $VPS_USER@$VPS_HOST "docker volume ls -q | grep -E '${COMPOSE_PROJECT_NAME}_|${PROJECT_NAME}_' | xargs -r docker volume rm" || echo "No project-specific volumes found to remove"

  echo -e "${YELLOW}⚠️ Project volumes cleared. This will reset database and cache data for $PROJECT_NAME only.${NC}"
fi

# Clear Docker build cache if force rebuild is enabled
if [ "$FORCE_REBUILD" = "true" ]; then
  echo -e "${YELLOW}🧹 Clearing Docker build cache...${NC}"
  ssh $VPS_USER@$VPS_HOST "docker builder prune -f"
  echo "Build cache cleared."
fi

# Build new containers
echo -e "${BLUE}🔨 Building containers...${NC}"
if [ "$FORCE_REBUILD" = "true" ]; then
  ssh $VPS_USER@$VPS_HOST "cd $VPS_PATH && docker-compose -f $COMPOSE_FILE -p $COMPOSE_PROJECT_NAME build --no-cache"
else
  ssh $VPS_USER@$VPS_HOST "cd $VPS_PATH && docker-compose -f $COMPOSE_FILE -p $COMPOSE_PROJECT_NAME build"
fi

# Start containers
echo -e "${BLUE}🚀 Starting containers...${NC}"
ssh $VPS_USER@$VPS_HOST "cd $VPS_PATH && docker-compose -f $COMPOSE_FILE -p $COMPOSE_PROJECT_NAME up -d"

# Wait for services to be ready
echo -e "${BLUE}⏳ Waiting for services to be ready...${NC}"
sleep 30

# Check if containers are running properly
echo -e "${BLUE}📊 Checking container status...${NC}"
ssh $VPS_USER@$VPS_HOST "cd $VPS_PATH && docker-compose -f $COMPOSE_FILE -p $COMPOSE_PROJECT_NAME ps"

# Run database migrations
echo -e "${BLUE}🗄️ Running database migrations...${NC}"
ssh $VPS_USER@$VPS_HOST "cd $VPS_PATH && docker-compose -f $COMPOSE_FILE -p $COMPOSE_PROJECT_NAME exec -T app php artisan migrate --force"

# Clear all caches to resolve volume cache issues
echo -e "${BLUE}🧹 Clearing application caches...${NC}"
ssh $VPS_USER@$VPS_HOST "cd $VPS_PATH && docker-compose -f $COMPOSE_FILE -p $COMPOSE_PROJECT_NAME exec -T app php artisan config:clear"
ssh $VPS_USER@$VPS_HOST "cd $VPS_PATH && docker-compose -f $COMPOSE_FILE -p $COMPOSE_PROJECT_NAME exec -T app php artisan cache:clear"
ssh $VPS_USER@$VPS_HOST "cd $VPS_PATH && docker-compose -f $COMPOSE_FILE -p $COMPOSE_PROJECT_NAME exec -T app php artisan route:clear"
ssh $VPS_USER@$VPS_HOST "cd $VPS_PATH && docker-compose -f $COMPOSE_FILE -p $COMPOSE_PROJECT_NAME exec -T app php artisan view:clear"

# Clear Redis cache if it exists
echo -e "${BLUE}🔴 Clearing Redis cache...${NC}"
ssh $VPS_USER@$VPS_HOST "cd $VPS_PATH && docker-compose -f $COMPOSE_FILE -p $COMPOSE_PROJECT_NAME exec -T redis redis-cli FLUSHALL" || echo "Redis cache clear failed (container might not be ready yet)"

# Optimize for production
echo -e "${BLUE}⚡ Optimizing for production...${NC}"
ssh $VPS_USER@$VPS_HOST "cd $VPS_PATH && docker-compose -f $COMPOSE_FILE -p $COMPOSE_PROJECT_NAME exec -T app php artisan config:cache"
ssh $VPS_USER@$VPS_HOST "cd $VPS_PATH && docker-compose -f $COMPOSE_FILE -p $COMPOSE_PROJECT_NAME exec -T app php artisan route:cache"
ssh $VPS_USER@$VPS_HOST "cd $VPS_PATH && docker-compose -f $COMPOSE_FILE -p $COMPOSE_PROJECT_NAME exec -T app php artisan view:cache"

# Set proper permissions (using the dev user that's configured in Dockerfile)
echo -e "${BLUE}🔐 Setting proper permissions...${NC}"
ssh $VPS_USER@$VPS_HOST "cd $VPS_PATH && docker-compose -f $COMPOSE_FILE -p $COMPOSE_PROJECT_NAME exec -T --user root app chown -R dev:dev storage bootstrap/cache && chmod -R 775 storage bootstrap/cache" || echo "Permission setting failed (this is OK if files are already owned correctly)"

# Restart queue and scheduler to ensure they pick up new code
echo -e "${BLUE}🔄 Restarting queue and scheduler services...${NC}"
ssh $VPS_USER@$VPS_HOST "cd $VPS_PATH && docker-compose -f $COMPOSE_FILE -p $COMPOSE_PROJECT_NAME restart queue scheduler"

# Setup SSL auto-renewal if SSL is enabled
if [ -n "$SSL_DOMAIN" ] && [ -n "$SSL_EMAIL" ]; then
  echo -e "${BLUE}🔒 Setting up SSL auto-renewal...${NC}"

  # Create renewal script on the server
  ssh $VPS_USER@$VPS_HOST "cat > /usr/local/bin/renew-ssl-$PROJECT_NAME.sh << 'EOF'
#!/bin/bash
LOG_FILE=\"/var/log/ssl-renewal-$PROJECT_NAME.log\"
PROJECT_NAME=\"$COMPOSE_PROJECT_NAME\"
COMPOSE_FILE=\"$VPS_PATH/$COMPOSE_FILE\"
docker-compose -f \$COMPOSE_FILE -p \$PROJECT_NAME exec -T certbot certbot renew --quiet --webroot -w /var/www/html
if [ \$? -eq 0 ]; then
  docker-compose -f \$COMPOSE_FILE -p \$PROJECT_NAME exec -T nginx nginx -s reload
  echo \"\$(date): SSL certificates renewed successfully\" >> \$LOG_FILE
else
  echo \"\$(date): SSL certificate renewal failed\" >> \$LOG_FILE
fi
EOF"

  ssh $VPS_USER@$VPS_HOST "chmod +x /usr/local/bin/renew-ssl-$PROJECT_NAME.sh"

  # Add to crontab if not already present
  ssh $VPS_USER@$VPS_HOST "if ! crontab -l 2>/dev/null | grep -q 'renew-ssl-$PROJECT_NAME.sh'; then (crontab -l 2>/dev/null; echo '0 0,12 * * * /usr/local/bin/renew-ssl-$PROJECT_NAME.sh') | crontab -; echo 'SSL auto-renewal cron job added'; fi"
fi

echo ""
echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo ""
echo -e "${BLUE}📋 Project Information:${NC}"
echo "  Project Name: $PROJECT_NAME"
echo "  Environment: $DEPLOY_ENV"
echo "  Container Prefix: $COMPOSE_PROJECT_NAME"
echo "  Nginx Container: ${PROJECT_NAME}_nginx_prod"
echo ""
echo -e "${BLUE}🌐 Access URLs:${NC}"
echo "  HTTP:  http://$VPS_HOST:$NGINX_PORT_80"
echo "  HTTPS: https://$VPS_HOST:$NGINX_PORT_443"
if [ -n "$SSL_DOMAIN" ]; then
  echo "  Domain: https://$SSL_DOMAIN"
fi
echo ""
echo -e "${BLUE}🔧 Useful Commands:${NC}"
echo "  # View logs"
echo "  ssh $VPS_USER@$VPS_HOST 'cd $VPS_PATH && docker-compose -f $COMPOSE_FILE -p $COMPOSE_PROJECT_NAME logs'"
echo ""
echo "  # Force rebuild"
echo "  FORCE_REBUILD=true ./deploy.sh"
echo ""
echo "  # Clear project volumes (safe - only affects this project)"
echo "  CLEAR_VOLUMES=true ./deploy.sh"
echo ""
echo -e "${GREEN}🎉 Your $PROJECT_NAME project is now live!${NC}"
