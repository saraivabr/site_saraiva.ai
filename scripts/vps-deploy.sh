#!/bin/bash
#
# VPS Deploy Script for SARAIVA.AI
# Automated deployment with backup and rollback
# Usage: bash scripts/vps-deploy.sh [domain]
# Example: bash scripts/vps-deploy.sh staging.saraiva.ai
#

set -euo pipefail
IFS=$'\n\t'

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
DOMAIN="${1:-staging.saraiva.ai}"
APP_DIR="/var/www/${DOMAIN}"
BACKUP_DIR="/var/backups/${DOMAIN}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="/var/log/deploy_${DOMAIN}_${TIMESTAMP}.log"

# Verify running as root
if [ "$EUID" -ne 0 ]; then 
   echo -e "${RED}✗ This script must be run as root${NC}"
   exit 1
fi

# Functions
print_success() {
    echo -e "${GREEN}✓ $1${NC}" | tee -a "$LOG_FILE"
}

print_error() {
    echo -e "${RED}✗ $1${NC}" | tee -a "$LOG_FILE"
    exit 1
}

print_info() {
    echo -e "${YELLOW}→ $1${NC}" | tee -a "$LOG_FILE"
}

print_step() {
    echo "" | tee -a "$LOG_FILE"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}" | tee -a "$LOG_FILE"
    echo -e "${BLUE}$1${NC}" | tee -a "$LOG_FILE"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}" | tee -a "$LOG_FILE"
}

# Trap errors and cleanup
trap 'on_error' ERR

on_error() {
    print_error "Deployment failed! Rolling back..."
    if [ -d "$BACKUP_DIR/dist_${TIMESTAMP}" ]; then
        rm -rf "${APP_DIR}/dist"
        cp -r "$BACKUP_DIR/dist_${TIMESTAMP}" "${APP_DIR}/dist"
        systemctl reload nginx
        print_success "Rolled back to previous version"
    fi
    exit 1
}

# Start
echo ""
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo -e "${GREEN}🚀 SARAIVA.AI Deployment - ${DOMAIN}${NC}"
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo ""
echo "Deployment started: $(date)" | tee -a "$LOG_FILE"
echo "Domain: ${DOMAIN}" | tee -a "$LOG_FILE"
echo "App Dir: ${APP_DIR}" | tee -a "$LOG_FILE"
echo ""

# Step 1: Verify directories
print_step "Step 1/7: Verifying deployment environment"
if [ ! -d "$APP_DIR/.git" ]; then
    print_error "Application directory not found or not a git repo: $APP_DIR"
fi
mkdir -p "$BACKUP_DIR"
print_success "Environment verified"

# Step 2: Create backup
print_step "Step 2/7: Creating backup"
if [ -d "$APP_DIR/dist" ]; then
    print_info "Backing up current dist directory..."
    cp -r "$APP_DIR/dist" "$BACKUP_DIR/dist_${TIMESTAMP}"
    print_success "Backup created: $BACKUP_DIR/dist_${TIMESTAMP}"
else
    print_info "No existing dist directory to backup"
fi

# Step 3: Fetch latest code
print_step "Step 3/7: Fetching latest code from repository"
cd "$APP_DIR"

if ! git fetch origin; then
    print_error "Failed to fetch from remote repository"
fi
print_success "Code fetched from remote"

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    print_info "Uncommitted changes detected, stashing..."
    git stash
    print_info "Changes stashed"
fi

# Step 4: Checkout and reset
print_step "Step 4/7: Checking out main branch"
if ! git checkout main; then
    print_error "Failed to checkout main branch"
fi

if ! git reset --hard origin/main; then
    print_error "Failed to reset to origin/main"
fi
print_success "Repository ready at latest version"

# Show commit info
LATEST_COMMIT=$(git log -1 --oneline)
print_info "Latest commit: $LATEST_COMMIT"

# Step 5: Install and build
print_step "Step 5/7: Installing dependencies and building"
print_info "Installing npm dependencies..."
if ! npm install --legacy-peer-deps 2>&1 | tail -5 | tee -a "$LOG_FILE"; then
    print_error "Failed to install npm dependencies"
fi
print_success "Dependencies installed"

print_info "Building application..."
if ! npm run build 2>&1 | tail -10 | tee -a "$LOG_FILE"; then
    print_error "Build process failed"
fi
print_success "Build completed"

# Step 6: Verify build
print_step "Step 6/7: Verifying build output"
if [ ! -f "$APP_DIR/dist/index.html" ]; then
    print_error "Build verification failed - dist/index.html not found"
fi

BUILD_SIZE=$(du -sh "$APP_DIR/dist" | cut -f1)
FILE_COUNT=$(find "$APP_DIR/dist" -type f | wc -l)
print_success "Build verified - Size: $BUILD_SIZE, Files: $FILE_COUNT"

# Step 7: Reload web server
print_step "Step 7/7: Reloading web server"
print_info "Testing Nginx configuration..."
if ! nginx -t 2>&1 | grep -q "successful"; then
    print_error "Nginx configuration test failed"
fi
print_success "Nginx configuration valid"

print_info "Reloading Nginx..."
if ! systemctl reload nginx; then
    print_error "Failed to reload Nginx"
fi
print_success "Nginx reloaded successfully"

# Cleanup old backups (keep last 5)
print_step "Cleaning up old backups"
cd "$BACKUP_DIR"
BACKUP_COUNT=$(ls -d dist_* 2>/dev/null | wc -l)
if [ "$BACKUP_COUNT" -gt 5 ]; then
    print_info "Found $BACKUP_COUNT backups, keeping last 5..."
    ls -d dist_* | sort -r | tail -n +6 | while read backup; do
        print_info "Removing old backup: $backup"
        rm -rf "$backup"
    done
    print_success "Cleanup completed"
else
    print_success "Backup count: $BACKUP_COUNT (no cleanup needed)"
fi

# Final summary
echo ""
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Deployment Completed Successfully!${NC}"
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}Deployment Summary:${NC}"
echo "  Domain: ${DOMAIN}"
echo "  Build Size: ${BUILD_SIZE}"
echo "  Build Files: ${FILE_COUNT}"
echo "  Latest Commit: ${LATEST_COMMIT}"
echo "  Deployment Log: ${LOG_FILE}"
echo ""
echo -e "${GREEN}🌐 Application URL: https://${DOMAIN}${NC}"
echo ""
echo "Deployment completed: $(date)" >> "$LOG_FILE"
