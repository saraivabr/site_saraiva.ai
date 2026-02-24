# Cloudflare DNS Setup for staging.saraiva.ai

## Overview

This guide documents the setup of Cloudflare DNS for the staging environment of saraiva.ai. The staging instance runs on a dedicated VPS (Ubuntu 22.04) at IP address `84.247.128.56`.

**Key Configuration:**
- **Domain**: staging.saraiva.ai
- **Target IP**: 84.247.128.56
- **Proxy Status**: ☁️ Enabled (Orange Cloud)
- **Features**: CDN, DDoS Protection, Automatic HTTPS

## Architecture

```
┌─────────────────────────────────────────┐
│         User Request                    │
│      staging.saraiva.ai                │
└────────────────┬────────────────────────┘
                 │
                 ▼
        ┌────────────────┐
        │  Cloudflare    │ ☁️ Orange Cloud
        │  (Proxy)       │ • CDN
        │  • DDoS        │ • Security
        │  • Cache       │ • HTTPS
        └────────────────┘
                 │
                 ▼
        ┌────────────────┐
        │  VPS           │
        │  84.247.128.56 │
        │  (Nginx)       │
        └────────────────┘
                 │
                 ▼
        ┌────────────────┐
        │  React App     │
        │  /var/www/     │
        │  staging.      │
        │  saraiva.ai    │
        └────────────────┘
```

## Prerequisites

Before running the setup script, ensure:

1. **Cloudflare Account**
   - Email: `fellipesaraivabarbosa@gmail.com`
   - API Key: Store securely (never commit to git)
   - Domain registered and active in Cloudflare

2. **VPS Requirements**
   - OS: Ubuntu 22.04 LTS
   - IP: 84.247.128.56
   - SSH access as root
   - Nginx installed (via `vps-setup.sh`)

3. **Tools Required**
   - `curl` (API calls)
   - `jq` (JSON parsing)
   - Both installed automatically if missing

## Setup Instructions

### Step 1: Prepare Credentials

⚠️ **SECURITY WARNING**: Never hardcode credentials in version control!

Options:
- **Option A (Local Testing)**: Edit script with credentials temporarily
- **Option B (Production)**: Use environment variables
- **Option C (Recommended)**: Use `.env` file (git-ignored)

```bash
# .env (add to .gitignore)
export CLOUDFLARE_EMAIL="your-email@example.com"
export CLOUDFLARE_API_KEY="your-api-key"
```

### Step 2: Run Setup Script

```bash
# From project root
bash scripts/cloudflare-dns-setup.sh
```

**Output Example:**
```
🌐 Cloudflare DNS Setup - Starting...
================================================
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Step 1/5: Validating Configuration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Configuration validated
→ Domain: staging.saraiva.ai
→ Target IP: 84.247.128.56
→ Proxy: true

[... more steps ...]

✓ DNS Configuration Complete!

Configuration Details:
  Domain: staging.saraiva.ai
  IP Address: 84.247.128.56
  Proxy Status: Enabled (Orange Cloud) ☁️
  DNS Status: active
```

### Step 3: Verify DNS Propagation

```bash
# Check DNS resolution
nslookup staging.saraiva.ai
dig staging.saraiva.ai

# Check it points to Cloudflare
whois staging.saraiva.ai
```

Expected output:
```
staging.saraiva.ai has address 104.21.x.x  (Cloudflare IP, not your VPS)
```

This is correct! Cloudflare proxy is working.

## Script Breakdown

### What the Script Does

1. **Validates Configuration**
   - Checks credentials
   - Verifies required tools (curl, jq)
   - Validates domain configuration

2. **Gets Zone ID**
   - Queries Cloudflare API for zone ID of `saraiva.ai`
   - Required for DNS operations

3. **Checks Existing Records**
   - Queries existing A records for `staging.saraiva.ai`
   - Decides to create or update

4. **Creates/Updates DNS Record**
   - Type: A (IPv4 address)
   - Name: staging.saraiva.ai
   - Content: 84.247.128.56
   - TTL: 3600 seconds
   - Proxied: true (enables Cloudflare features)

5. **Verifies Configuration**
   - Retrieves record details
   - Confirms IP and proxy settings
   - Displays final status

## Cloudflare API Reference

### Authentication
- **Email Header**: `X-Auth-Email`
- **API Key Header**: `X-Auth-Key`
- **Content-Type**: `application/json`

### Key Endpoints Used

**Get Zones**
```
GET /client/v4/zones?name=saraiva.ai
```

**Get DNS Records**
```
GET /client/v4/zones/{zone_id}/dns_records?name=staging.saraiva.ai&type=A
```

**Create DNS Record**
```
POST /client/v4/zones/{zone_id}/dns_records
{
  "type": "A",
  "name": "staging.saraiva.ai",
  "content": "84.247.128.56",
  "ttl": 3600,
  "proxied": true
}
```

**Update DNS Record**
```
PUT /client/v4/zones/{zone_id}/dns_records/{record_id}
{
  "type": "A",
  "name": "staging.saraiva.ai",
  "content": "84.247.128.56",
  "ttl": 3600,
  "proxied": true
}
```

For more details: [Cloudflare API Documentation](https://developers.cloudflare.com/api/operations/dns-records-create-dns-record)

## Proxy Status Explanation

### Orange Cloud (Proxied: true) ✅ Current Setup
- **Cloudflare Benefits**:
  - 🌍 CDN Distribution
  - 🛡️ DDoS Protection
  - 🔒 Automatic HTTPS
  - ⚡ Performance optimization
  - 📊 Analytics

- **Configuration Needed**:
  - VPS Nginx should accept requests from Cloudflare
  - May need `X-Forwarded-For` headers for real IPs

- **DNS Resolution**:
  - Shows Cloudflare edge IP (104.21.x.x)
  - Not the actual VPS IP

### Gray Cloud (Proxied: false)
- DNS only
- Direct IP exposure
- No Cloudflare protection

## Production Considerations

### 1. SSL/TLS Configuration

Cloudflare offers multiple SSL modes:

**Mode: Full (Recommended)**
```
Client → Cloudflare (HTTPS) → VPS (HTTPS)
```
- Requires valid cert on VPS
- Use Let's Encrypt + Nginx setup

**Mode: Full (Strict)**
- Requires Cloudflare-signed cert
- Better security

**Mode: Flexible**
- Client → Cloudflare (HTTPS)
- Cloudflare → VPS (HTTP)
- Less secure

Current VPS setup uses Let's Encrypt via Certbot (see `vps-setup.sh`).

### 2. Real IP Preservation

Add to Nginx config to get actual user IPs:

```nginx
# /etc/nginx/sites-available/staging.saraiva.ai
real_ip_module on;
set_real_ip_from 173.245.48.0/20;  # Cloudflare IPs
set_real_ip_from 103.21.244.0/22;
set_real_ip_from 103.22.200.0/22;
# ... more Cloudflare IPs
real_ip_header CF-Connecting-IP;
```

Get full list: [Cloudflare IP Ranges](https://www.cloudflare.com/ips/)

### 3. Cache Rules

Configure in Cloudflare Dashboard:
- Cache static assets (CSS, JS, images)
- Bypass cache for API endpoints
- Set appropriate TTLs

### 4. Security Rules

Recommended Cloudflare rules:
- Challenge bots
- Block countries if needed
- Rate limiting
- OWASP ModSecurity Core Rule Set

## Troubleshooting

### DNS Not Resolving

```bash
# Check propagation
dig staging.saraiva.ai @8.8.8.8

# Check nameservers
dig staging.saraiva.ai NS

# Should show Cloudflare nameservers
```

### Connection Timeout

1. Check VPS firewall allows HTTP/HTTPS
2. Verify Nginx is running: `systemctl status nginx`
3. Check Nginx config: `nginx -t`
4. Review Cloudflare DDoS settings

### SSL Certificate Errors

1. Verify Nginx has valid cert from Let's Encrypt
2. Check cert validity: `openssl x509 -in /etc/letsencrypt/live/staging.saraiva.ai/fullchain.pem -text -noout`
3. Ensure Cloudflare SSL mode matches VPS setup

### Cloudflare API Errors

Common errors:

- **Invalid API Key**: Verify key in dashboard
- **Zone Not Found**: Confirm domain is added to Cloudflare
- **Record Already Exists**: Script updates automatically
- **Auth Failed**: Check email/API key

## Updating Configuration

### Change Target IP

Edit script:
```bash
TARGET_IP="new.ip.address"
```

Then re-run:
```bash
bash scripts/cloudflare-dns-setup.sh
```

### Disable Proxy

```bash
PROXY_ENABLED="false"
bash scripts/cloudflare-dns-setup.sh
```

### Use Environment Variables

```bash
export CLOUDFLARE_EMAIL="your@email.com"
export CLOUDFLARE_API_KEY="your-key"
bash scripts/cloudflare-dns-setup.sh
```

Modify script to use env vars:
```bash
CLOUDFLARE_EMAIL="${CLOUDFLARE_EMAIL:-fallback@email.com}"
CLOUDFLARE_API_KEY="${CLOUDFLARE_API_KEY:-fallback-key}"
```

## Related Documentation

- [VPS Setup](./DEPLOY-PRONTO.md) - Server configuration
- [Nginx Configuration](./scripts/nginx-proxy.conf) - Web server setup
- [Deployment Guide](./DEPLOY-PRONTO.md) - Application deployment

## Verification Checklist

- ✅ Cloudflare account active
- ✅ API key valid
- ✅ VPS IP (84.247.128.56) is correct
- ✅ Nginx installed and running on VPS
- ✅ SSL certificate from Let's Encrypt
- ✅ DNS record points to VPS
- ✅ Proxy enabled in Cloudflare
- ✅ Can access https://staging.saraiva.ai
- ✅ Real IP preservation configured (optional but recommended)

## Support

For issues:
1. Check script output for API errors
2. Verify credentials
3. Check Cloudflare dashboard for record status
4. Consult [Cloudflare Docs](https://developers.cloudflare.com/)
5. Review VPS logs: `tail -f /var/log/nginx/error.log`

---

**Last Updated**: 2026-02-24  
**Status**: Production Ready  
**Maintainer**: SARAIVA.AI Team
