#!/bin/bash

# QuickForm Backup Script
# This script creates backups of the database and important files

set -e

# Configuration
BACKUP_DIR="/var/backups/quickform"
DATE=$(date +%Y%m%d_%H%M%S)
COMPOSE_FILE="docker-compose.yml"

# Check if SSL compose file exists and use it if available
if [ -f "docker-compose.ssl.yml" ]; then
    COMPOSE_FILE="docker-compose.ssl.yml"
fi

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

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

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

log "📦 Starting QuickForm backup..."

# Database backup
log "🗄️ Creating database backup..."
if docker-compose -f $COMPOSE_FILE exec -T db mysqldump -u quickform_user -pquickform_password quickform_prod > "$BACKUP_DIR/database_$DATE.sql"; then
    log "✅ Database backup created: database_$DATE.sql"
else
    error "Failed to create database backup"
fi

# Compress database backup
gzip "$BACKUP_DIR/database_$DATE.sql"
log "📦 Database backup compressed: database_$DATE.sql.gz"

# File backup (storage and uploads)
log "📁 Creating file backup..."
tar -czf "$BACKUP_DIR/files_$DATE.tar.gz" \
    --exclude='storage/logs/*' \
    --exclude='storage/framework/cache/*' \
    --exclude='storage/framework/sessions/*' \
    --exclude='storage/framework/views/*' \
    storage/ \
    public/uploads/ 2>/dev/null || warning "Some files could not be backed up"

log "✅ File backup created: files_$DATE.tar.gz"

# Environment file backup
log "⚙️ Creating environment backup..."
cp .env "$BACKUP_DIR/env_$DATE.backup"
log "✅ Environment backup created: env_$DATE.backup"

# Cleanup old backups (keep last 7 days)
log "🧹 Cleaning up old backups..."
find "$BACKUP_DIR" -name "*.gz" -mtime +7 -delete
find "$BACKUP_DIR" -name "*.backup" -mtime +7 -delete

# Show backup summary
log "📊 Backup summary:"
echo "Database: $BACKUP_DIR/database_$DATE.sql.gz"
echo "Files: $BACKUP_DIR/files_$DATE.tar.gz"
echo "Environment: $BACKUP_DIR/env_$DATE.backup"

# Show backup directory size
BACKUP_SIZE=$(du -sh "$BACKUP_DIR" | cut -f1)
log "💾 Total backup size: $BACKUP_SIZE"

log "🎉 Backup completed successfully!" 