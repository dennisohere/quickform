#!/bin/bash
# List volumes that would be affected by CLEAR_VOLUMES=true

# Configuration (same as deploy.sh)
PROJECT_NAME="${PROJECT_NAME:-quickform}"
DEPLOY_ENV="${DEPLOY_ENV:-sandbox}"
COMPOSE_PROJECT_NAME="${PROJECT_NAME}_${DEPLOY_ENV}"

echo "🔍 Volume Analysis for Project: $PROJECT_NAME"
echo "Environment: $DEPLOY_ENV"
echo "Compose Project Name: $COMPOSE_PROJECT_NAME"
echo ""

echo "📋 Volumes that would be cleared with CLEAR_VOLUMES=true:"
echo ""

# List volumes that match the project pattern
echo "Project-specific volumes:"
docker volume ls --format "table {{.Name}}\t{{.Driver}}\t{{.Size}}" | grep -E "${COMPOSE_PROJECT_NAME}_|${PROJECT_NAME}_" || echo "  No project-specific volumes found"

echo ""
echo "🔍 All volumes on the system:"
docker volume ls --format "table {{.Name}}\t{{.Driver}}\t{{.Size}}"

echo ""
echo "💡 Note: CLEAR_VOLUMES=true will only remove volumes matching:"
echo "   - ${COMPOSE_PROJECT_NAME}_*"
echo "   - ${PROJECT_NAME}_*"
echo ""
echo "✅ This is safe - it won't affect other projects' volumes." 