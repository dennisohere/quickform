#!/bin/bash
# Deployment script for QuickForm

set -e

# Environment variables
VPS_HOST="${VPS_HOST}"
VPS_USER="${VPS_USER}"
VPS_PATH="${VPS_PATH}"
SSL_DOMAIN="${SSL_DOMAIN}"
SSL_EMAIL="${SSL_EMAIL}"
SSL_SUBDOMAINS="${SSL_SUBDOMAINS:-www,api}"
DEPLOY_ENV="${DEPLOY_ENV:-production}"

echo "Starting deployment to $DEPLOY_ENV environment..."

# Pull latest changes
ssh $VPS_USER@$VPS_HOST "cd $VPS_PATH && git fetch origin && git reset --hard origin/$DEPLOY_ENV"

# Make SSL setup script executable
ssh $VPS_USER@$VPS_HOST "cd $VPS_PATH && chmod +x ssl-setup.sh"

# Determine which compose file to use
COMPOSE_FILE="docker-compose.yml"
if [ -n "$SSL_DOMAIN" ] && [ -n "$SSL_EMAIL" ]; then
  COMPOSE_FILE="docker-compose.ssl.yml"
  echo "Using SSL-enabled Docker Compose configuration for $SSL_DOMAIN"
else
  echo "Using standard Docker Compose configuration"
fi

# Stop existing containers
ssh $VPS_USER@$VPS_HOST "cd $VPS_PATH && docker-compose -p quickform_$DEPLOY_ENV down"

# Build new containers
ssh $VPS_USER@$VPS_HOST "cd $VPS_PATH && docker-compose -f $COMPOSE_FILE -p quickform_$DEPLOY_ENV build --no-cache"

# Start containers
ssh $VPS_USER@$VPS_HOST "cd $VPS_PATH && docker-compose -f $COMPOSE_FILE -p quickform_$DEPLOY_ENV up -d"

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 30

# Run database migrations
ssh $VPS_USER@$VPS_HOST "cd $VPS_PATH && docker-compose -f $COMPOSE_FILE -p quickform_$DEPLOY_ENV exec -T app php artisan migrate --force"

# Clear caches
ssh $VPS_USER@$VPS_HOST "cd $VPS_PATH && docker-compose -f $COMPOSE_FILE -p quickform_$DEPLOY_ENV exec -T app php artisan config:clear"
ssh $VPS_USER@$VPS_HOST "cd $VPS_PATH && docker-compose -f $COMPOSE_FILE -p quickform_$DEPLOY_ENV exec -T app php artisan cache:clear"
ssh $VPS_USER@$VPS_HOST "cd $VPS_PATH && docker-compose -f $COMPOSE_FILE -p quickform_$DEPLOY_ENV exec -T app php artisan route:clear"
ssh $VPS_USER@$VPS_HOST "cd $VPS_PATH && docker-compose -f $COMPOSE_FILE -p quickform_$DEPLOY_ENV exec -T app php artisan view:clear"

# Optimize for production
ssh $VPS_USER@$VPS_HOST "cd $VPS_PATH && docker-compose -f $COMPOSE_FILE -p quickform_$DEPLOY_ENV exec -T app php artisan config:cache"
ssh $VPS_USER@$VPS_HOST "cd $VPS_PATH && docker-compose -f $COMPOSE_FILE -p quickform_$DEPLOY_ENV exec -T app php artisan route:cache"
ssh $VPS_USER@$VPS_HOST "cd $VPS_PATH && docker-compose -f $COMPOSE_FILE -p quickform_$DEPLOY_ENV exec -T app php artisan view:cache"

# Set proper permissions
ssh $VPS_USER@$VPS_HOST "cd $VPS_PATH && docker-compose -f $COMPOSE_FILE -p quickform_$DEPLOY_ENV exec -T app chown -R www-data:www-data storage bootstrap/cache"

# Setup SSL auto-renewal if SSL is enabled
if [ -n "$SSL_DOMAIN" ] && [ -n "$SSL_EMAIL" ]; then
  echo "Setting up SSL auto-renewal..."
  
  # Create renewal script on the server
  ssh $VPS_USER@$VPS_HOST "cat > /usr/local/bin/renew-ssl-docker.sh << 'EOF'
#!/bin/bash
LOG_FILE=\"/var/log/ssl-renewal.log\"
PROJECT_NAME=\"quickform_$DEPLOY_ENV\"
COMPOSE_FILE=\"$VPS_PATH/docker-compose.ssl.yml\"
docker-compose -f \$COMPOSE_FILE -p \$PROJECT_NAME exec -T certbot certbot renew --quiet --webroot -w /var/www/html
if [ \$? -eq 0 ]; then
  docker-compose -f \$COMPOSE_FILE -p \$PROJECT_NAME exec -T nginx nginx -s reload
  echo \"\$(date): SSL certificates renewed successfully\" >> \$LOG_FILE
else
  echo \"\$(date): SSL certificate renewal failed\" >> \$LOG_FILE
fi
EOF"
  
  ssh $VPS_USER@$VPS_HOST "chmod +x /usr/local/bin/renew-ssl-docker.sh"
  
  # Add to crontab if not already present
  ssh $VPS_USER@$VPS_HOST "if ! crontab -l 2>/dev/null | grep -q 'renew-ssl-docker.sh'; then (crontab -l 2>/dev/null; echo '0 0,12 * * * /usr/local/bin/renew-ssl-docker.sh') | crontab -; echo 'SSL auto-renewal cron job added'; fi"
fi

echo "Deployment completed successfully!" 