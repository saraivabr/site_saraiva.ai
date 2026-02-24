#!/bin/bash
#
# VPS Setup Script for SARAIVA.AI
# Target: Ubuntu 22.04 LTS
# Usage: bash vps-setup.sh [domain] [email]
# Example: bash vps-setup.sh staging.saraiva.ai contato@saraiva.ai
#

set -euo pipefail  # Exit on error, undefined vars, pipe failures
IFS=$'\n\t'

echo "🚀 SARAIVA.AI VPS Setup - Starting..."
echo "================================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration - with argument override
DOMAIN="${1:-staging.saraiva.ai}"
EMAIL="${2:-contato@saraiva.ai}"
APP_DIR="/var/www/${DOMAIN}"
REPO_URL="https://github.com/saraivabr/site_saraiva.ai.git"
NODE_VERSION="20"
BACKUP_DIR="/var/backups/${DOMAIN}"

# Verify running as root
if [ "$EUID" -ne 0 ]; then 
   print_error "This script must be run as root"
   exit 1
fi

# Functions
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
    exit 1
}

print_info() {
    echo -e "${YELLOW}→ $1${NC}"
}

print_step() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

check_command() {
    if command -v "$1" &> /dev/null; then
        return 0
    else
        return 1
    fi
}

run_command() {
    if eval "$1"; then
        return 0
    else
        print_error "Command failed: $1"
    fi
}

echo ""
echo "VPS Setup Configuration:"
echo "  Domain: $DOMAIN"
echo "  Email: $EMAIL"
echo "  App Directory: $APP_DIR"
echo "  Node Version: $NODE_VERSION"
echo ""
read -p "Press Enter to continue or Ctrl+C to cancel..." -t 10 || true

# Step 1: Update system
print_step "Step 1/9: Updating system packages"
if ! apt update; then
    print_error "Failed to update package lists"
fi
if ! DEBIAN_FRONTEND=noninteractive apt upgrade -y; then
    print_error "Failed to upgrade system packages"
fi
print_success "System updated"

# Step 2: Install dependencies
print_step "Step 2/9: Installing dependencies"
PACKAGES=(nginx certbot python3-certbot-nginx git curl build-essential ufw wget net-tools)
MISSING_PACKAGES=()

for package in "${PACKAGES[@]}"; do
    if ! dpkg -l | grep -q "^ii  $package"; then
        MISSING_PACKAGES+=("$package")
    else
        print_success "Package already installed: $package"
    fi
done

if [ ${#MISSING_PACKAGES[@]} -gt 0 ]; then
    if ! apt install -y "${MISSING_PACKAGES[@]}"; then
        print_error "Failed to install packages: ${MISSING_PACKAGES[*]}"
    fi
    print_success "Packages installed: ${MISSING_PACKAGES[*]}"
else
    print_success "All dependencies already installed"
fi

# Step 3: Install Node.js 20
print_step "Step 3/9: Installing Node.js ${NODE_VERSION}"
if check_command node; then
    NODE_CURRENT=$(node -v)
    NODE_MAJOR=$(node -v | cut -d'.' -f1 | cut -d'v' -f2)
    if [ "$NODE_MAJOR" = "$NODE_VERSION" ]; then
        print_success "Node.js ${NODE_CURRENT} already installed (correct version)"
    else
        print_info "Node.js ${NODE_CURRENT} installed but upgrading to v${NODE_VERSION}..."
        if ! curl -fsSL "https://deb.nodesource.com/setup_${NODE_VERSION}.x" | bash -; then
            print_error "Failed to add NodeSource repository"
        fi
        if ! apt install -y nodejs; then
            print_error "Failed to install/upgrade Node.js"
        fi
        print_success "Node.js upgraded to $(node -v)"
    fi
else
    print_info "Installing Node.js ${NODE_VERSION}..."
    if ! curl -fsSL "https://deb.nodesource.com/setup_${NODE_VERSION}.x" | bash -; then
        print_error "Failed to add NodeSource repository"
    fi
    if ! apt install -y nodejs; then
        print_error "Failed to install Node.js"
    fi
    print_success "Node.js $(node -v) installed"
fi

# Verify npm
if ! check_command npm; then
    print_error "npm not found after Node.js installation"
fi
print_success "npm $(npm -v) ready"

# Step 4: Clone or update repository
print_step "Step 4/9: Setting up repository"
mkdir -p "$(dirname "$APP_DIR")"

if [ -d "$APP_DIR/.git" ]; then
    print_info "Repository exists at $APP_DIR, updating..."
    cd "$APP_DIR"
    if ! git fetch origin; then
        print_error "Failed to fetch from remote repository"
    fi
    if ! git checkout main; then
        print_error "Failed to checkout main branch"
    fi
    if ! git reset --hard origin/main; then
        print_error "Failed to reset to origin/main"
    fi
    print_success "Repository updated"
elif [ -d "$APP_DIR" ]; then
    print_error "Directory exists but is not a git repository: $APP_DIR"
else
    print_info "Cloning repository..."
    if ! git clone "$REPO_URL" "$APP_DIR"; then
        print_error "Failed to clone repository"
    fi
    cd "$APP_DIR"
    print_success "Repository cloned"
fi

# Create backup directory
mkdir -p "$BACKUP_DIR"
print_success "Repository ready at $APP_DIR"

# Step 5: Install npm dependencies and build
print_step "Step 5/9: Installing dependencies and building"
cd "$APP_DIR"

print_info "Installing npm dependencies..."
if ! npm install --legacy-peer-deps 2>&1 | tail -10; then
    print_error "Failed to install npm dependencies"
fi
print_success "Dependencies installed"

print_info "Building application..."
if ! npm run build; then
    print_error "Build failed"
fi

# Verify build output
if [ ! -f "$APP_DIR/dist/index.html" ]; then
    print_error "Build succeeded but dist/index.html not found"
fi

print_success "Build completed successfully"

# Step 6: Configure Nginx
print_step "Step 6/9: Configuring Nginx for ${DOMAIN}"

NGINX_AVAILABLE="/etc/nginx/sites-available/${DOMAIN}"
NGINX_ENABLED="/etc/nginx/sites-enabled/${DOMAIN}"

# Create Nginx configuration
cat > "$NGINX_AVAILABLE" << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name DOMAIN_PLACEHOLDER;

    root APP_DIR_PLACEHOLDER/dist;
    index index.html index.htm;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;

    # SPA routing - all requests go to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets (versioned files)
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Don't cache index.html
    location = /index.html {
        add_header Cache-Control "public, max-age=0, must-revalidate";
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "OK";
        add_header Content-Type text/plain;
    }

    # Security: deny access to hidden files
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }

    # Security: deny access to sensitive files
    location ~ ~$ {
        deny all;
        access_log off;
        log_not_found off;
    }
}
EOF

# Replace placeholders
sed -i "s|DOMAIN_PLACEHOLDER|${DOMAIN}|g" "$NGINX_AVAILABLE"
sed -i "s|APP_DIR_PLACEHOLDER|${APP_DIR}|g" "$NGINX_AVAILABLE"

print_success "Nginx config created at $NGINX_AVAILABLE"

# Enable site
ln -sf "$NGINX_AVAILABLE" "$NGINX_ENABLED"

# Disable default site
if [ -f /etc/nginx/sites-enabled/default ]; then
    rm -f /etc/nginx/sites-enabled/default
    print_info "Default site disabled"
fi

# Test Nginx config
print_info "Testing Nginx configuration..."
if ! nginx -t 2>&1 | tail -5; then
    print_error "Nginx configuration test failed"
fi

print_success "Nginx configuration validated"

# Reload Nginx
print_info "Reloading Nginx..."
if ! systemctl reload nginx; then
    print_error "Failed to reload Nginx"
fi

print_success "Nginx configured and reloaded"

# Step 7: Configure firewall (UFW)
print_step "Step 7/9: Configuring firewall (UFW)"

# Enable UFW
if ufw status | grep -q "inactive"; then
    print_info "Enabling UFW..."
    echo "y" | ufw enable > /dev/null
    print_success "UFW enabled"
else
    print_success "UFW already enabled"
fi

# Configure firewall rules
print_info "Configuring firewall rules..."

# SSH - allow from anywhere (be careful with this)
ufw allow 22/tcp comment "SSH" > /dev/null 2>&1 || true

# HTTP and HTTPS
ufw allow 80/tcp comment "HTTP" > /dev/null 2>&1 || true
ufw allow 443/tcp comment "HTTPS" > /dev/null 2>&1 || true

# Display status
echo ""
print_info "Firewall status:"
ufw status numbered
print_success "Firewall configured"

# Step 8: Setup auto-renewal
print_step "Step 8/9: Configuring SSL auto-renewal"

# Install certbot-auto-renewal timer if not present
if ! systemctl list-unit-files | grep -q certbot.timer; then
    print_info "Installing certbot auto-renewal service..."
    systemctl enable certbot.timer
    systemctl start certbot.timer
    print_success "Certbot auto-renewal enabled"
else
    print_success "Certbot auto-renewal already configured"
fi

# Step 9: SSL Certificate (Let's Encrypt)
print_step "Step 9/9: Setting up SSL certificate with Let's Encrypt"
echo ""
echo -e "${YELLOW}⚠️  Important: DNS must be configured before proceeding${NC}"
echo "   Please ensure ${DOMAIN} points to this server's IP address"
echo ""
read -p "Press Enter to continue with SSL setup (or Ctrl+C to skip)..." -t 30 || {
    print_info "SSL setup skipped"
    SKIP_SSL=true
}

if [ "${SKIP_SSL:-false}" != true ]; then
    print_info "Running certbot for ${DOMAIN}..."
    
    if certbot --nginx \
        -d "${DOMAIN}" \
        --non-interactive \
        --agree-tos \
        --email "${EMAIL}" \
        --redirect \
        --keep-until-expiring; then
        
        print_success "SSL certificate installed successfully"
        
        # Verify certificate
        print_info "Certificate details:"
        certbot certificates -d "${DOMAIN}" 2>/dev/null || true
        
    else
        print_error "Failed to setup SSL certificate"
    fi
else
    print_info "Skipping SSL setup (can be done later with: certbot --nginx -d ${DOMAIN})"
fi

# Final summary
echo ""
print_step "✓ VPS Setup Complete!"
echo ""
echo -e "${GREEN}Configuration Summary:${NC}"
echo "  Domain: ${DOMAIN}"
echo "  App Directory: ${APP_DIR}"
echo "  Node.js: $(node -v)"
echo "  npm: $(npm -v)"
echo "  Nginx: $(nginx -v 2>&1)"
echo ""

echo -e "${GREEN}Next Steps:${NC}"
echo "  1. ✓ VPS system configured"
echo "  2. ✓ Nginx installed and configured"
echo "  3. ✓ Node.js 20 installed"
echo "  4. ✓ Repository cloned and built"
echo "  5. ✓ Firewall configured"
if [ "${SKIP_SSL:-false}" = true ]; then
    echo "  6. □ Run certbot for SSL: certbot --nginx -d ${DOMAIN}"
    echo "  7. □ Setup auto-deploy: bash scripts/vps-deploy.sh"
else
    echo "  6. ✓ SSL certificate configured"
    echo "  7. □ Setup auto-deploy: bash scripts/vps-deploy.sh"
fi
echo ""

echo -e "${GREEN}Useful Commands:${NC}"
echo "  Check Nginx status:    systemctl status nginx"
echo "  View Nginx error log:  tail -f /var/log/nginx/error.log"
echo "  View Nginx access log: tail -f /var/log/nginx/access.log"
echo "  Rebuild app:           cd ${APP_DIR} && npm run build"
echo "  Test Nginx config:     nginx -t"
echo "  Reload Nginx:          systemctl reload nginx"
echo "  Check SSL cert:        certbot certificates"
echo "  Renew SSL (dry-run):   certbot renew --dry-run"
echo "  Full deploy:           bash ${APP_DIR}/scripts/vps-deploy.sh"
echo ""

echo -e "${BLUE}═══════════════════════════════════════════════${NC}"
echo -e "${GREEN}🌐 Application URL: https://${DOMAIN}${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════${NC}"
echo ""
