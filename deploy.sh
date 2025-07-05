#!/bin/bash

# QuickForm Deployment Script
# This script handles deployment of the QuickForm application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-staging}
COMPOSE_FILE="docker-compose.yml"

if [ "$ENVIRONMENT" = "production" ]; then
    COMPOSE_FILE="docker-compose.prod.yml"
fi

echo -e "${GREEN}🚀 Starting QuickForm deployment for $ENVIRONMENT environment${NC}"

# Function to log messages
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    error "Docker is not running. Please start Docker and try again."
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    error "Docker Compose is not installed. Please install Docker Compose and try again."
fi

# Check if the compose file exists
if [ ! -f "$COMPOSE_FILE" ]; then
    error "Docker Compose file $COMPOSE_FILE not found."
fi

log "📦 Pulling latest changes from Git..."
git fetch origin
git reset --hard origin/$ENVIRONMENT

log "🔧 Setting up environment file..."
if [ ! -f .env ]; then
    cp .env.example .env
    warning "Created .env file from .env.example. Please configure it with your settings."
fi

log "🐳 Stopping existing containers..."
docker-compose -f $COMPOSE_FILE down

log "🔨 Building new containers..."
docker-compose -f $COMPOSE_FILE build --no-cache

log "🚀 Starting containers..."
docker-compose -f $COMPOSE_FILE up -d

log "⏳ Waiting for services to be ready..."
sleep 30

log "🗄️ Running database migrations..."
docker-compose -f $COMPOSE_FILE exec -T app php artisan migrate --force

log "🧹 Clearing application caches..."
docker-compose -f $COMPOSE_FILE exec -T app php artisan config:clear
docker-compose -f $COMPOSE_FILE exec -T app php artisan cache:clear
docker-compose -f $COMPOSE_FILE exec -T app php artisan route:clear
docker-compose -f $COMPOSE_FILE exec -T app php artisan view:clear

log "⚡ Optimizing for production..."
docker-compose -f $COMPOSE_FILE exec -T app php artisan config:cache
docker-compose -f $COMPOSE_FILE exec -T app php artisan route:cache
docker-compose -f $COMPOSE_FILE exec -T app php artisan view:cache

log "🔐 Setting proper permissions..."
docker-compose -f $COMPOSE_FILE exec -T app chown -R www-data:www-data storage bootstrap/cache

log "🏥 Running health check..."
sleep 10
if curl -f http://localhost/health > /dev/null 2>&1; then
    log "✅ Health check passed!"
else
    warning "Health check failed. The application might not be fully ready yet."
fi

log "🎉 Deployment completed successfully!"
log "📊 Container status:"
docker-compose -f $COMPOSE_FILE ps

echo -e "${GREEN}✨ QuickForm is now deployed and running!${NC}" 