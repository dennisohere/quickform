#!/bin/bash
# SSL Certificate Renewal Script for Sandbox

LOG_FILE="/var/log/ssl-renewal-sandbox.log"
PROJECT_NAME="quickform_sandbox"
COMPOSE_FILE="${VPS_PATH:-/var/www/quickform}/docker-compose.ssl.yml"

# Renew certificates
docker-compose -f $COMPOSE_FILE -p $PROJECT_NAME exec -T certbot certbot renew --quiet --webroot -w /var/www/html

# Reload nginx if certificates were renewed
if [ $? -eq 0 ]; then
  docker-compose -f $COMPOSE_FILE -p $PROJECT_NAME exec -T nginx nginx -s reload
  echo "$(date): SSL certificates renewed successfully" >> $LOG_FILE
else
  echo "$(date): SSL certificate renewal failed" >> $LOG_FILE
fi 