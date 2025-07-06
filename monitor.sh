#!/bin/bash

# QuickForm Monitoring Script
# This script monitors the health of the application and its services

set -e

# Configuration
COMPOSE_FILE="docker-compose.yml"
HEALTH_URL="http://localhost/health"
DETAILED_HEALTH_URL="http://localhost/health/detailed"

# Check if SSL compose file exists and use it if available
if [ -f "docker-compose.ssl.yml" ]; then
    COMPOSE_FILE="docker-compose.ssl.yml"
    HEALTH_URL="https://localhost/health"
    DETAILED_HEALTH_URL="https://localhost/health/detailed"
fi

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Function to log messages
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}"
}

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        error "Docker is not running"
        return 1
    fi
    log "✅ Docker is running"
    return 0
}

# Check container status
check_containers() {
    info "Checking container status..."
    
    if [ ! -f "$COMPOSE_FILE" ]; then
        error "Docker Compose file not found: $COMPOSE_FILE"
        return 1
    fi
    
    # Get container status
    CONTAINERS=$(docker-compose -f $COMPOSE_FILE ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}")
    
    echo "$CONTAINERS" | while IFS= read -r line; do
        if [[ $line == *"Up"* ]]; then
            log "✅ $line"
        elif [[ $line == *"Exit"* ]]; then
            error "❌ $line"
        else
            warning "⚠️ $line"
        fi
    done
}

# Check application health
check_health() {
    info "Checking application health..."
    
    # Simple health check
    if curl -f -s "$HEALTH_URL" > /dev/null; then
        log "✅ Application health check passed"
    else
        error "❌ Application health check failed"
        return 1
    fi
    
    # Detailed health check
    if curl -f -s "$DETAILED_HEALTH_URL" > /dev/null; then
        log "✅ Detailed health check passed"
        
        # Get detailed health status
        HEALTH_DATA=$(curl -s "$DETAILED_HEALTH_URL")
        echo "$HEALTH_DATA" | jq -r '.checks | to_entries[] | "  " + .key + ": " + .value' 2>/dev/null || echo "  Unable to parse health data"
    else
        error "❌ Detailed health check failed"
        return 1
    fi
}

# Check disk space
check_disk_space() {
    info "Checking disk space..."
    
    DISK_USAGE=$(df -h / | tail -1 | awk '{print $5}' | sed 's/%//')
    
    if [ "$DISK_USAGE" -lt 80 ]; then
        log "✅ Disk usage: ${DISK_USAGE}%"
    elif [ "$DISK_USAGE" -lt 90 ]; then
        warning "⚠️ Disk usage: ${DISK_USAGE}%"
    else
        error "❌ Disk usage: ${DISK_USAGE}% (critical)"
    fi
}

# Check memory usage
check_memory() {
    info "Checking memory usage..."
    
    MEMORY_USAGE=$(free | grep Mem | awk '{printf "%.1f", $3/$2 * 100.0}')
    
    if (( $(echo "$MEMORY_USAGE < 80" | bc -l) )); then
        log "✅ Memory usage: ${MEMORY_USAGE}%"
    elif (( $(echo "$MEMORY_USAGE < 90" | bc -l) )); then
        warning "⚠️ Memory usage: ${MEMORY_USAGE}%"
    else
        error "❌ Memory usage: ${MEMORY_USAGE}% (critical)"
    fi
}

# Check recent logs for errors
check_logs() {
    info "Checking recent logs for errors..."
    
    # Check for errors in the last 100 lines of app logs
    ERROR_COUNT=$(docker-compose -f $COMPOSE_FILE logs --tail=100 app 2>/dev/null | grep -i "error\|exception\|fatal" | wc -l)
    
    if [ "$ERROR_COUNT" -eq 0 ]; then
        log "✅ No recent errors found in application logs"
    else
        warning "⚠️ Found $ERROR_COUNT potential errors in recent logs"
        docker-compose -f $COMPOSE_FILE logs --tail=50 app | grep -i "error\|exception\|fatal" | tail -5
    fi
}

# Main monitoring function
main() {
    echo -e "${BLUE}🔍 QuickForm System Monitor${NC}"
    echo "=================================="
    
    # Run all checks
    check_docker
    echo ""
    
    check_containers
    echo ""
    
    check_health
    echo ""
    
    check_disk_space
    echo ""
    
    check_memory
    echo ""
    
    check_logs
    echo ""
    
    log "🎉 System monitoring completed!"
}

# Run main function
main 