#!/bin/bash

# Docker Compose Services Management Script
# Usage: ./scripts/docker-services.sh [up|down|logs|status|restart|clean|build]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE_FILE="${SCRIPT_DIR}/docker-compose.yml"
ENV_FILE="${SCRIPT_DIR}/.env.docker"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[Docker Services]${NC} $1"
}

error() {
    echo -e "${RED}[Error]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[Warning]${NC} $1"
}

check_docker() {
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose is not installed"
        exit 1
    fi
}

check_env() {
    if [ ! -f "$ENV_FILE" ]; then
        warn ".env.docker not found, using defaults"
    fi
}

up() {
    log "Starting services..."
    docker-compose -f "$COMPOSE_FILE" up -d
    
    sleep 3
    log "Services started successfully!"
    log "Redis: localhost:6379"
    log "Meilisearch: localhost:7700"
    log "Redis Commander: localhost:8081"
    log "Nginx: localhost:80"
}

down() {
    log "Stopping services..."
    docker-compose -f "$COMPOSE_FILE" down
    log "Services stopped"
}

logs() {
    local service="${1:-}"
    if [ -z "$service" ]; then
        log "Showing logs for all services (Ctrl+C to exit)..."
        docker-compose -f "$COMPOSE_FILE" logs -f
    else
        log "Showing logs for $service..."
        docker-compose -f "$COMPOSE_FILE" logs -f "$service"
    fi
}

status() {
    log "Service status:"
    docker-compose -f "$COMPOSE_FILE" ps
    
    log "\nHealth checks:"
    docker-compose -f "$COMPOSE_FILE" ps --format 'table {{.Service}}\t{{.State}}\t{{.Status}}'
}

restart() {
    local service="${1:-}"
    if [ -z "$service" ]; then
        log "Restarting all services..."
        docker-compose -f "$COMPOSE_FILE" restart
    else
        log "Restarting $service..."
        docker-compose -f "$COMPOSE_FILE" restart "$service"
    fi
}

clean() {
    warn "This will remove all containers, volumes, and data"
    read -p "Continue? (yes/no) " -r
    if [[ $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        log "Cleaning up..."
        docker-compose -f "$COMPOSE_FILE" down -v
        rm -rf "$SCRIPT_DIR"/data/* "$SCRIPT_DIR"/logs/*
        log "Cleanup complete"
    else
        log "Cleanup cancelled"
    fi
}

build() {
    log "Building images..."
    docker-compose -f "$COMPOSE_FILE" build --no-cache
    log "Build complete"
}

shell() {
    local service="${1:-redis}"
    log "Opening shell in $service..."
    docker-compose -f "$COMPOSE_FILE" exec "$service" sh
}

usage() {
    cat << EOF
Docker Compose Services Management

Usage: ./scripts/docker-services.sh [command] [options]

Commands:
    up              Start all services
    down            Stop all services
    logs [service]  Show logs (optionally for specific service)
    status          Show service status and health
    restart [srv]   Restart services (or specific service)
    clean           Remove all containers and volumes
    build           Build images
    shell [service] Open shell in service (default: redis)
    help            Show this help message

Examples:
    ./scripts/docker-services.sh up
    ./scripts/docker-services.sh logs meilisearch
    ./scripts/docker-services.sh restart redis
    ./scripts/docker-services.sh shell redis-commander

EOF
}

# Main
check_docker
check_env

case "${1:-help}" in
    up)
        up
        ;;
    down)
        down
        ;;
    logs)
        logs "$2"
        ;;
    status)
        status
        ;;
    restart)
        restart "$2"
        ;;
    clean)
        clean
        ;;
    build)
        build
        ;;
    shell)
        shell "$2"
        ;;
    help)
        usage
        ;;
    *)
        error "Unknown command: $1"
        usage
        exit 1
        ;;
esac
