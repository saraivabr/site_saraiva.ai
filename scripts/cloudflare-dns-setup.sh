#!/bin/bash
#
# Cloudflare DNS Setup Script for staging.saraiva.ai
# Creates DNS A record and enables Cloudflare proxy for CDN + DDoS protection
# Target: staging.saraiva.ai → 84.247.128.56
# Usage: bash cloudflare-dns-setup.sh
#

set -e

echo "🌐 Cloudflare DNS Setup - Starting..."
echo "================================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration - EDIT THESE
CLOUDFLARE_EMAIL="fellipesaraivabarbosa@gmail.com"
CLOUDFLARE_API_KEY="c81188d3999224b21b3f5a8532b6f9b17ce05"
DOMAIN="saraiva.ai"
SUBDOMAIN="staging"
FULL_DOMAIN="${SUBDOMAIN}.${DOMAIN}"
TARGET_IP="84.247.128.56"
PROXY_ENABLED="true"  # Enable Cloudflare proxy for CDN + DDoS

# Functions
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}→ $1${NC}"
}

print_step() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

validate_input() {
    print_step "Step 1/5: Validating Configuration"
    
    if [ -z "$CLOUDFLARE_EMAIL" ] || [ -z "$CLOUDFLARE_API_KEY" ]; then
        print_error "Cloudflare credentials not set"
        exit 1
    fi
    
    if [ -z "$DOMAIN" ] || [ -z "$SUBDOMAIN" ]; then
        print_error "Domain configuration not set"
        exit 1
    fi
    
    if ! command -v curl &> /dev/null; then
        print_error "curl is required but not installed"
        exit 1
    fi
    
    if ! command -v jq &> /dev/null; then
        print_error "jq is required but not installed"
        print_info "Installing jq..."
        apt-get update && apt-get install -y jq
    fi
    
    print_success "Configuration validated"
    print_info "Domain: $FULL_DOMAIN"
    print_info "Target IP: $TARGET_IP"
    print_info "Proxy: $PROXY_ENABLED"
}

get_zone_id() {
    print_step "Step 2/5: Getting Zone ID for $DOMAIN"
    
    local zone_response=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones?name=$DOMAIN" \
        -H "X-Auth-Email: $CLOUDFLARE_EMAIL" \
        -H "X-Auth-Key: $CLOUDFLARE_API_KEY" \
        -H "Content-Type: application/json")
    
    local success=$(echo "$zone_response" | jq -r '.success')
    
    if [ "$success" != "true" ]; then
        print_error "Failed to get zone ID"
        print_info "Response: $(echo "$zone_response" | jq -r '.errors[0].message // .message')"
        exit 1
    fi
    
    local zone_count=$(echo "$zone_response" | jq '.result | length')
    
    if [ "$zone_count" -eq 0 ]; then
        print_error "Zone not found for domain: $DOMAIN"
        exit 1
    fi
    
    ZONE_ID=$(echo "$zone_response" | jq -r '.result[0].id')
    print_success "Zone ID retrieved: $ZONE_ID"
}

check_existing_record() {
    print_step "Step 3/5: Checking for Existing DNS Record"
    
    local dns_response=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records?name=$FULL_DOMAIN&type=A" \
        -H "X-Auth-Email: $CLOUDFLARE_EMAIL" \
        -H "X-Auth-Key: $CLOUDFLARE_API_KEY" \
        -H "Content-Type: application/json")
    
    local success=$(echo "$dns_response" | jq -r '.success')
    
    if [ "$success" != "true" ]; then
        print_error "Failed to query DNS records"
        print_info "Response: $(echo "$dns_response" | jq -r '.errors[0].message // .message')"
        exit 1
    fi
    
    local record_count=$(echo "$dns_response" | jq '.result | length')
    
    if [ "$record_count" -gt 0 ]; then
        local existing_id=$(echo "$dns_response" | jq -r '.result[0].id')
        local existing_ip=$(echo "$dns_response" | jq -r '.result[0].content')
        local existing_proxy=$(echo "$dns_response" | jq -r '.result[0].proxied')
        
        print_info "Existing record found:"
        print_info "  ID: $existing_id"
        print_info "  IP: $existing_ip"
        print_info "  Proxied: $existing_proxy"
        
        # Check if update is needed
        if [ "$existing_ip" = "$TARGET_IP" ] && [ "$existing_proxy" = "$PROXY_ENABLED" ]; then
            print_success "Record is already up to date"
            RECORD_ID=$existing_id
            RECORD_EXISTS="true"
        else
            print_info "Record needs update"
            RECORD_ID=$existing_id
            RECORD_EXISTS="true"
        fi
    else
        print_info "No existing record found - will create new"
        RECORD_EXISTS="false"
    fi
}

create_or_update_record() {
    print_step "Step 4/5: Creating/Updating DNS A Record"
    
    if [ "$RECORD_EXISTS" = "true" ]; then
        print_info "Updating existing record..."
        
        local update_response=$(curl -s -X PUT "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/$RECORD_ID" \
            -H "X-Auth-Email: $CLOUDFLARE_EMAIL" \
            -H "X-Auth-Key: $CLOUDFLARE_API_KEY" \
            -H "Content-Type: application/json" \
            -d '{
                "type": "A",
                "name": "'"$FULL_DOMAIN"'",
                "content": "'"$TARGET_IP"'",
                "ttl": 3600,
                "proxied": '"${PROXY_ENABLED,,}"'
            }')
        
        local success=$(echo "$update_response" | jq -r '.success')
        
        if [ "$success" != "true" ]; then
            print_error "Failed to update DNS record"
            print_info "Response: $(echo "$update_response" | jq -r '.errors[0].message // .message')"
            exit 1
        fi
        
        print_success "DNS record updated successfully"
    else
        print_info "Creating new record..."
        
        local create_response=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
            -H "X-Auth-Email: $CLOUDFLARE_EMAIL" \
            -H "X-Auth-Key: $CLOUDFLARE_API_KEY" \
            -H "Content-Type: application/json" \
            -d '{
                "type": "A",
                "name": "'"$FULL_DOMAIN"'",
                "content": "'"$TARGET_IP"'",
                "ttl": 3600,
                "proxied": '"${PROXY_ENABLED,,}"'
            }')
        
        local success=$(echo "$create_response" | jq -r '.success')
        
        if [ "$success" != "true" ]; then
            print_error "Failed to create DNS record"
            print_info "Response: $(echo "$create_response" | jq -r '.errors[0].message // .message')"
            exit 1
        fi
        
        RECORD_ID=$(echo "$create_response" | jq -r '.result.id')
        print_success "DNS record created successfully"
        print_info "Record ID: $RECORD_ID"
    fi
}

verify_dns() {
    print_step "Step 5/5: Verifying DNS Configuration"
    
    local verify_response=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/$RECORD_ID" \
        -H "X-Auth-Email: $CLOUDFLARE_EMAIL" \
        -H "X-Auth-Key: $CLOUDFLARE_API_KEY" \
        -H "Content-Type: application/json")
    
    local success=$(echo "$verify_response" | jq -r '.success')
    
    if [ "$success" != "true" ]; then
        print_error "Failed to verify DNS record"
        exit 1
    fi
    
    local record_name=$(echo "$verify_response" | jq -r '.result.name')
    local record_content=$(echo "$verify_response" | jq -r '.result.content')
    local record_proxied=$(echo "$verify_response" | jq -r '.result.proxied')
    local record_status=$(echo "$verify_response" | jq -r '.result.status')
    
    echo ""
    print_success "DNS Configuration Complete!"
    echo ""
    echo "Configuration Details:"
    echo "  Domain: $record_name"
    echo "  IP Address: $record_content"
    echo "  Proxy Status: $([ "$record_proxied" = "true" ] && echo "Enabled (Orange Cloud) ☁️ " || echo "Disabled (Gray Cloud) ⭕")"
    echo "  DNS Status: $record_status"
    echo ""
    
    if [ "$record_proxied" = "true" ]; then
        print_success "Cloudflare proxy is ENABLED ✓"
        echo "  - CDN enabled"
        echo "  - DDoS protection enabled"
        echo "  - Automatic HTTPS enabled"
    fi
    
    echo ""
    print_info "Next steps:"
    echo "  1. Update your VPS Nginx configuration if needed"
    echo "  2. Deploy your application to /var/www/staging.saraiva.ai"
    echo "  3. Test: curl -I https://$FULL_DOMAIN"
    echo ""
}

# Main execution
main() {
    validate_input
    get_zone_id
    check_existing_record
    create_or_update_record
    verify_dns
}

main
