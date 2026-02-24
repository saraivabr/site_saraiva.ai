#!/bin/bash

# Verify Docker Services Health Check Script
# Usage: ./scripts/verify-docker-services.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE_FILE="${SCRIPT_DIR}/docker-compose.yml"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() { echo -e "${BLUE}[Info]${NC} $1"; }
success() { echo -e "${GREEN}[✓]${NC} $1"; }
error() { echo -e "${RED}[✗]${NC} $1"; }
warn() { echo -e "${YELLOW}[⚠]${NC} $1"; }

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Docker Services Health Verification  ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}\n"

# Check if services are running
log "Checking if services are running..."

docker-compose -f "$COMPOSE_FILE" ps | grep -q "app_redis" && success "Redis container found" || error "Redis container not found"
docker-compose -f "$COMPOSE_FILE" ps | grep -q "app_meilisearch" && success "Meilisearch container found" || error "Meilisearch container not found"
docker-compose -f "$COMPOSE_FILE" ps | grep -q "app_redis_commander" && success "Redis Commander container found" || error "Redis Commander container not found"
docker-compose -f "$COMPOSE_FILE" ps | grep -q "app_nginx" && success "Nginx container found" || error "Nginx container not found"

echo ""
log "Checking service connectivity...\n"

# Redis connectivity
echo -n "Testing Redis (6379)... "
if docker-compose -f "$COMPOSE_FILE" exec -T redis redis-cli ping &>/dev/null; then
    success "Redis responding"
else
    error "Redis not responding"
fi

# Meilisearch connectivity
echo -n "Testing Meilisearch (7700)... "
if docker-compose -f "$COMPOSE_FILE" exec -T meilisearch curl -s http://localhost:7700/health &>/dev/null; then
    success "Meilisearch responding"
else
    error "Meilisearch not responding"
fi

# Redis Commander connectivity
echo -n "Testing Redis Commander (8081)... "
if docker-compose -f "$COMPOSE_FILE" exec -T redis-commander curl -s http://localhost:8081 &>/dev/null; then
    success "Redis Commander responding"
else
    error "Redis Commander not responding"
fi

# Nginx connectivity
echo -n "Testing Nginx (80)... "
if docker-compose -f "$COMPOSE_FILE" exec -T nginx wget -q -O- http://localhost/health &>/dev/null; then
    success "Nginx responding"
else
    error "Nginx not responding"
fi

echo ""
log "Checking service health status...\n"

docker-compose -f "$COMPOSE_FILE" ps --format "table {{.Service}}\t{{.Status}}"

echo ""
log "Checking volumes...\n"

# Check if volumes exist and have data
if [ -d "$SCRIPT_DIR/data/redis" ] && [ "$(ls -A $SCRIPT_DIR/data/redis)" ]; then
    success "Redis volume has data"
else
    warn "Redis volume is empty"
fi

if [ -d "$SCRIPT_DIR/data/meilisearch" ] && [ "$(ls -A $SCRIPT_DIR/data/meilisearch)" ]; then
    success "Meilisearch volume has data"
else
    warn "Meilisearch volume is empty"
fi

if [ -d "$SCRIPT_DIR/logs/nginx" ] && [ "$(ls -A $SCRIPT_DIR/logs/nginx)" ]; then
    success "Nginx logs directory has files"
else
    warn "Nginx logs directory is empty"
fi

echo ""
log "Checking resource usage...\n"

docker stats --no-stream app_redis app_meilisearch app_redis_commander app_nginx 2>/dev/null || warn "Could not retrieve resource stats"

echo ""
log "Checking network...\n"

docker network ls | grep -q "app_network" && success "Docker network 'app_network' exists" || error "Docker network 'app_network' not found"

# Check network connectivity between services
echo -n "Testing Redis → Meilisearch connectivity... "
if docker-compose -f "$COMPOSE_FILE" exec -T redis ping -c 1 meilisearch &>/dev/null; then
    success "Connected"
else
    error "Not connected"
fi

echo ""
log "Quick connectivity tests...\n"

# Test with curl through Nginx
echo -n "Testing Meilisearch via Nginx proxy... "
if curl -s http://localhost/search/indexes &>/dev/null; then
    success "Accessible via Nginx"
else
    warn "Not accessible via Nginx (service may need to warm up)"
fi

echo ""
echo -e "${BLUE}════════════════════════════════════════${NC}"
success "Verification complete!"
echo -e "${BLUE}════════════════════════════════════════${NC}\n"

log "Service endpoints:"
echo "  Redis:           redis://localhost:6379"
echo "  Meilisearch:     http://localhost:7700"
echo "  Redis Commander: http://localhost:8081"
echo "  Nginx:           http://localhost"
echo ""

log "View full logs:"
echo "  ./scripts/docker-services.sh logs [service]"
echo ""

log "View detailed status:"
echo "  ./scripts/docker-services.sh status"
echo ""
