# Scalingo Deployment Guide - Vite + React + TypeScript SPA

This guide covers the optimized production deployment configuration for this Vite + React + TypeScript single-page application (SPA) on Scalingo.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Project Structure](#project-structure)
4. [Buildpacks Configuration](#buildpacks-configuration)
5. [Procfile Optimization](#procfile-optimization)
6. [Environment Variables](#environment-variables)
7. [Custom Domain Setup](#custom-domain-setup)
8. [SSL/TLS Certificate Configuration](#ssltls-certificate-configuration)
9. [Deployment Process](#deployment-process)
10. [Post-Deployment Verification](#post-deployment-verification)
11. [Troubleshooting](#troubleshooting)
12. [Performance Optimization](#performance-optimization)

## Overview

This application is optimized for Scalingo with:
- **Buildpacks**: Node.js buildpack for compilation and runtime
- **Procfile**: Production-grade process configuration with proper build step
- **Environment Management**: Comprehensive variable documentation
- **SSL**: Full HTTPS support with custom domains
- **Performance**: Optimized caching headers and production settings

### Key Features

- ✅ SPA routing with fallback to index.html
- ✅ Static asset optimization
- ✅ Production build caching
- ✅ Custom domain support
- ✅ Automatic SSL/TLS certificates
- ✅ Environment-based configuration

## Prerequisites

### Required Tools

- [Scalingo CLI](https://doc.scalingo.com/cli) installed and configured
- Git repository initialized
- Node.js 18+ (optional, for local testing)
- Access to Scalingo account and application

### Scalingo Account Setup

```bash
# Install Scalingo CLI (macOS)
brew tap Scalingo/scalingo
brew install scalingo

# Or on other systems, see: https://doc.scalingo.com/cli

# Login to Scalingo
scalingo login

# List your applications
scalingo apps
```

## Project Structure

```
.
├── src/                          # React source code
├── public/                       # Static assets
├── dist/                         # Built application (generated)
├── server.js                     # Express server for SPA routing
├── vite.config.ts               # Vite configuration
├── Procfile                      # Scalingo process definition
├── .buildpacks                   # Buildpacks configuration
├── scalingo.json                 # Scalingo app configuration
├── .env.production.example       # Environment variables template
├── package.json                  # Node.js dependencies
└── docs/
    └── SCALINGO_DEPLOYMENT.md    # This file
```

## Buildpacks Configuration

### What is .buildpacks?

The `.buildpacks` file tells Scalingo which buildpacks to use for compiling and running the application.

### Current Configuration

```
https://github.com/heroku/heroku-buildpack-nodejs.git#v228
https://github.com/Scalingo/multi-buildpack.git
```

**Explanation:**

1. **Node.js Buildpack (v228)**: 
   - Installs Node.js and npm/yarn
   - Runs `npm install` to fetch dependencies
   - Executes `npm run build` via Procfile release phase
   - Provides runtime environment

2. **Multi-Buildpack**:
   - Allows using multiple buildpacks if needed
   - Currently optional but included for flexibility

### Buildpack Process

During deployment, Scalingo:

1. **Detects** the application type (Node.js via .buildpacks)
2. **Compiles** dependencies and assets:
   - Downloads Node.js runtime
   - Installs production dependencies
   - Caches node_modules for faster future builds
3. **Releases** using Procfile release phase:
   - Runs `npm run build` to create `dist/` folder
4. **Runs** the application:
   - Starts `node server.js` on assigned PORT

### Custom Buildpack Version

To update Node.js version, modify `.buildpacks`:

```
https://github.com/heroku/heroku-buildpack-nodejs.git#v230
https://github.com/Scalingo/multi-buildpack.git
```

Available versions: https://github.com/heroku/heroku-buildpack-nodejs/releases

## Procfile Optimization

### What is Procfile?

The `Procfile` defines the processes that run your application on Scalingo.

### Current Configuration

```procfile
web: NODE_ENV=production npm run build && node server.js
release: npm run build
```

**Components:**

1. **release phase** (`release: npm run build`):
   - Runs ONCE after deployment before the app starts
   - Builds React app: TypeScript compilation, asset bundling
   - Outputs optimized files to `dist/`
   - Fails deployment if build fails (safety check)

2. **web process** (`web: NODE_ENV=production npm run build && node server.js`):
   - Main process that serves the application
   - Runs on a dyno (container)
   - `NODE_ENV=production` enables:
     - Minified React (smaller bundle)
     - Optimized module loading
     - Reduced memory usage
   - `npm run build` (redundant but safe) ensures dist exists
   - `node server.js` starts Express server

### Why This Configuration?

- **Separation of Concerns**: Release phase handles one-time setup
- **Fail Fast**: Build errors prevent app startup
- **Repeatability**: Same build process locally and in production
- **Scalability**: Web process can be scaled independently

### Alternative Configurations

**Option 1: Simpler (if pre-building)**
```procfile
web: node server.js
release: npm run build
```

**Option 2: Multiple Processes (advanced)**
```procfile
web: node server.js
worker: node background-jobs.js
scheduler: node scheduler.js
release: npm run build
```

## Environment Variables

### Configuration Files

1. **Local Development**: `.env` (git-ignored)
2. **Production Template**: `.env.production.example` (git-tracked)
3. **Scalingo**: Set via Scalingo dashboard or CLI

### All Available Variables

Copy and configure these in Scalingo dashboard or via CLI:

```bash
# Node Environment
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# Build Configuration
NPM_CONFIG_PRODUCTION=false
YARN_PRODUCTION=false

# Vite Build Configuration
VITE_API_URL=https://your-domain.com/api
VITE_APP_NAME=Vite React App

# Database Configuration
DATABASE_URL=postgresql://user:password@host:port/database

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Security Headers
ENABLE_CORS=false
CORS_ORIGIN=https://your-domain.com

# Logging
LOG_LEVEL=info

# Cache Configuration
CACHE_CONTROL=public, max-age=3600, s-maxage=86400

# Optional: Custom Features
ENABLE_ANALYTICS=true
ANALYTICS_TOKEN=your-analytics-token
```

### Setting Variables via CLI

```bash
# Set a single variable
scalingo --app my-app env-set NODE_ENV=production

# Set multiple variables
scalingo --app my-app env-set \
  VITE_API_URL=https://api.example.com \
  VITE_SUPABASE_URL=https://project.supabase.co \
  VITE_SUPABASE_ANON_KEY=your-key

# View all variables
scalingo --app my-app env

# Remove a variable
scalingo --app my-app env-unset VARIABLE_NAME
```

### Setting Variables via Dashboard

1. Go to **Scalingo Dashboard** → Your App
2. Navigate to **Environment Variables** section
3. Add/edit variables as needed
4. Click **Save**
5. Application will restart automatically

### Critical Variables

These MUST be set in production:

| Variable | Purpose | Example |
|----------|---------|---------|
| `NODE_ENV` | Node environment | `production` |
| `PORT` | Server port | `3000` |
| `VITE_API_URL` | API endpoint | `https://api.example.com` |
| `VITE_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase public key | `eyJ...` |

### Optional Variables

These enhance functionality but aren't required:

- `LOG_LEVEL`: Control logging verbosity
- `ENABLE_ANALYTICS`: Enable/disable analytics
- `CACHE_CONTROL`: Customize cache headers

## Custom Domain Setup

### Prerequisites

- Registered domain name
- Access to domain registrar's DNS settings
- Scalingo application running

### Step 1: Add Domain to Scalingo

#### Via CLI

```bash
scalingo --app my-app domains-add example.com
scalingo --app my-app domains-add www.example.com
```

#### Via Dashboard

1. Go to **Scalingo Dashboard** → Your App
2. Navigate to **Domains** section
3. Click **Add a domain**
4. Enter domain name (e.g., `example.com`)
5. Note the target CNAME: `example-app.scalingo.io` (or similar)
6. Repeat for `www.example.com` if needed

### Step 2: Configure DNS Records

Update your domain registrar's DNS settings to point to Scalingo.

#### Option A: CNAME Record (Recommended)

For non-root domains, use CNAME:

```dns
CNAME  www             example-app.scalingo.io
CNAME  example.com     example-app.scalingo.io  (if supported)
```

#### Option B: A Record (Root Domain)

For root domain only:

```dns
A      example.com     203.0.113.42  (Scalingo IP - contact support)
```

#### DNS Configuration Examples

**Cloudflare:**
1. Login to Cloudflare dashboard
2. Select your domain
3. Go to DNS section
4. Create CNAME record:
   - Name: `example.com` or `www`
   - Content: `example-app.scalingo.io`
   - TTL: Auto
5. Save

**GoDaddy:**
1. Login to GoDaddy
2. Go to DNS settings
3. Add/edit CNAME record:
   - Name: `www`
   - Value: `example-app.scalingo.io`
4. Save (may take 24-48 hours)

**Namecheap:**
1. Login to Namecheap
2. Go to Domain List → Manage
3. Go to Advanced DNS
4. Add/edit CNAME record:
   - Type: `CNAME`
   - Host: `www`
   - Value: `example-app.scalingo.io`
5. Save

### Step 3: Verify DNS Propagation

```bash
# Check DNS resolution (should show Scalingo IP)
nslookup example.com
dig example.com

# Test HTTPS access
curl -I https://example.com
```

### Step 4: Configure Application Routes

Update your app to recognize the custom domain:

**In `server.js` (optional, for header validation):**

```javascript
app.use((req, res, next) => {
  // Validate host header
  const allowedHosts = ['example.com', 'www.example.com', 'my-app.scalingo.io'];
  if (!allowedHosts.includes(req.get('host'))) {
    return res.status(403).send('Forbidden');
  }
  next();
});
```

**In `vite.config.ts` (for API calls):**

```typescript
export default defineConfig({
  define: {
    __API_URL__: JSON.stringify(process.env.VITE_API_URL || 'https://example.com/api'),
  },
});
```

## SSL/TLS Certificate Configuration

### Automatic SSL with Let's Encrypt

Scalingo automatically provides free SSL/TLS certificates via Let's Encrypt for all domains.

#### Automatic Setup

1. Add custom domain (see Custom Domain Setup section)
2. Scalingo automatically generates SSL certificate
3. Certificate renews automatically (90-day cycle)
4. HTTPS available at `https://example.com` after DNS propagation

**No manual configuration needed!**

#### Verify SSL Certificate

```bash
# Check certificate details
openssl s_client -connect example.com:443 -showcerts

# Or using curl
curl -v https://example.com
```

### Custom SSL Certificate (Optional)

If you have an existing certificate:

#### Via CLI

```bash
scalingo --app my-app certs-add \
  --cert-file ./path/to/cert.pem \
  --key-file ./path/to/key.pem \
  --name my-cert
```

#### Via Dashboard

1. Go to **Scalingo Dashboard** → Your App
2. Navigate to **SSL Certificates** section
3. Click **Add a certificate**
4. Upload certificate file (.pem)
5. Upload private key file (.key)
6. Click **Add**

### Force HTTPS

Ensure all traffic uses HTTPS:

**In `server.js`:**

```javascript
// Force HTTPS in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.get('X-Forwarded-Proto') !== 'https') {
      return res.redirect('https://' + req.get('Host') + req.url);
    }
    next();
  });
}
```

**Set security headers:**

```javascript
app.use((req, res, next) => {
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});
```

## Deployment Process

### Prerequisites

- Scalingo CLI installed
- Git repository with `.git` directory
- All configuration files in place (Procfile, .buildpacks, scalingo.json)

### Step 1: Initialize Scalingo App

```bash
# First time only: Create app on Scalingo
scalingo create my-app

# Or link existing app
scalingo link my-app

# Verify link
scalingo apps
```

### Step 2: Prepare Code

```bash
# Ensure all changes are committed
git status
git add .
git commit -m "Add Scalingo production configuration"

# Verify Procfile
cat Procfile

# Verify .buildpacks
cat .buildpacks
```

### Step 3: Deploy

```bash
# Deploy using git
git push scalingo main:main

# Or specific branch
git push scalingo develop:main

# Monitor deployment
scalingo --app my-app logs --follow
```

### Step 4: Set Environment Variables

```bash
scalingo --app my-app env-set \
  NODE_ENV=production \
  VITE_API_URL=https://api.example.com \
  VITE_SUPABASE_URL=https://project.supabase.co \
  VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Step 5: Add Custom Domain

See [Custom Domain Setup](#custom-domain-setup) section

### Complete Deployment Checklist

- [ ] App created on Scalingo
- [ ] Procfile configured
- [ ] .buildpacks configured
- [ ] Git remote added: `git remote add scalingo https://git.scalingo.com/my-app.git`
- [ ] Code pushed: `git push scalingo main`
- [ ] Build succeeds (check logs)
- [ ] Environment variables set
- [ ] Custom domain added
- [ ] DNS records configured
- [ ] HTTPS certificate generated
- [ ] App accessible at custom domain
- [ ] Performance verified

## Post-Deployment Verification

### Verify Deployment Success

```bash
# Check app status
scalingo --app my-app status

# View recent logs
scalingo --app my-app logs -n 50

# Test application
curl -I https://example.com

# Check headers
curl -v https://example.com
```

### Performance Checks

**Response Time:**
```bash
# Should be under 1 second
time curl https://example.com > /dev/null
```

**Bundle Size:**
```bash
# Check build output size
du -sh dist/
```

**JavaScript Performance:**
1. Open DevTools (F12)
2. Check Network tab
3. Verify asset sizes (JS should be < 200KB gzipped)
4. Check Console for errors

### Monitoring

**Via Scalingo Dashboard:**
1. Go to **Metrics** tab
2. Monitor:
   - Response times
   - Error rates
   - Memory usage
   - CPU usage

**Via Logs:**
```bash
# Stream logs in real-time
scalingo --app my-app logs --follow

# Filter for errors
scalingo --app my-app logs | grep ERROR
```

### Testing Checklist

- [ ] App loads at `https://example.com`
- [ ] HTTPS working (no insecure warnings)
- [ ] SPA routing works (navigate pages without reload)
- [ ] Static assets load correctly
- [ ] API calls work (if configured)
- [ ] No JavaScript errors in console
- [ ] Performance is acceptable (< 3s page load)
- [ ] Mobile responsive
- [ ] Forms/interactions work

## Troubleshooting

### Build Fails

**Error: "npm run build" failed**

```bash
# View detailed logs
scalingo --app my-app logs -n 100

# Check for:
# - TypeScript errors
# - Missing dependencies
# - Incompatible Node versions
```

**Solutions:**
1. Test build locally: `npm run build`
2. Fix any errors
3. Commit and push again

### Application Won't Start

**Error: Command failed with exit status 1**

```bash
# Check Node.js version
scalingo --app my-app run node --version

# View process logs
scalingo --app my-app logs
```

**Check server.js:**
- Verify PORT is configurable: `process.env.PORT || 3000`
- Verify HOST: `0.0.0.0` (not localhost)

### Domain Not Resolving

**DNS takes time to propagate:**
1. Wait 24-48 hours
2. Clear local DNS cache
3. Verify DNS records: `dig example.com`

**Solutions:**
```bash
# Flush local DNS (macOS)
sudo dscacheutil -flushcache

# Check Scalingo domain status
scalingo --app my-app domains
```

### HTTPS Certificate Issues

**Certificate not generated:**
1. Verify domain added: `scalingo --app my-app domains`
2. Verify DNS points to Scalingo
3. Wait a few minutes for certificate generation

**Mixed content warnings:**
1. Update API URLs in .env to use HTTPS
2. Add HSTS header in server.js

### Performance Issues

**Slow page load:**

1. Check metrics:
```bash
scalingo --app my-app metrics
```

2. Optimize:
   - Reduce bundle size: `npm run build -- --analyze`
   - Enable gzip in server.js
   - Use CDN for static assets

3. Scale up dyno type:
```bash
scalingo --app my-app scale web:Performance-M
```

### Out of Memory

**Error: JavaScript heap out of memory**

1. Increase dyno memory:
```bash
scalingo --app my-app scale web:Performance-L
```

2. Check for memory leaks in React code
3. Review NODE_OPTIONS if set

## Performance Optimization

### 1. Build Optimization

**Vite is already optimized, but ensure:**

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    minify: 'terser',
    sourcemap: false,  // Disable in production
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        }
      }
    }
  }
});
```

### 2. Server Optimization

**Enable gzip compression in server.js:**

```javascript
import compression from 'compression';

app.use(compression());
```

**Set cache headers:**

```javascript
app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: process.env.CACHE_CONTROL || '1d',
  etag: false,
  lastModified: false,
}));
```

### 3. Runtime Optimization

**Environment variables:**
```bash
# Optimize Node.js
NODE_OPTIONS=--max-old-space-size=512

# Production Node modules
NPM_CONFIG_PRODUCTION=false  # Install dev deps for building
```

### 4. Dyno Optimization

**Scalingo dyno types:**

| Type | Memory | Cost | Use Case |
|------|--------|------|----------|
| Hobby | 512 MB | Free | Development |
| Standard-1X | 512 MB | Low | Small apps |
| Standard-2X | 1024 MB | Low | Medium apps |
| Performance-M | 2.5 GB | Medium | High-traffic |
| Performance-L | 14 GB | High | Very large apps |

Choose based on your app's needs:

```bash
scalingo --app my-app scale web:Standard-2X
```

### 5. Database Optimization (if using PostgreSQL addon)

```bash
# Add PostgreSQL database
scalingo --app my-app addons-add scalingo-postgresql free

# View connection string
scalingo --app my-app env | grep DATABASE_URL
```

## Resources

### Official Documentation
- [Scalingo Documentation](https://doc.scalingo.com/)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Express Documentation](https://expressjs.com/)

### Deployment
- [Scalingo Deployment Guide](https://doc.scalingo.com/deployment/git)
- [Scalingo CLI Reference](https://doc.scalingo.com/cli)
- [Custom Domains on Scalingo](https://doc.scalingo.com/domains/custom-domain)

### Performance
- [Web Vitals](https://web.dev/vitals/)
- [Vite Performance Guide](https://vitejs.dev/guide/performance.html)
- [React Performance](https://react.dev/learn/render-and-commit)

### Security
- [Scalingo Security](https://doc.scalingo.com/security)
- [OWASP Top 10](https://owasp.org/Top10/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/nodejs-security/)

## Support

### Getting Help

1. **Scalingo Support**: support@scalingo.com
2. **Documentation**: https://doc.scalingo.com/
3. **Community**: GitHub discussions
4. **Status**: https://status.scalingo.com/

### Quick Commands Reference

```bash
# Core operations
scalingo login                                    # Login
scalingo create my-app                           # Create app
scalingo --app my-app logs                       # View logs
scalingo --app my-app logs --follow              # Stream logs
git push scalingo main                           # Deploy

# Configuration
scalingo --app my-app env-set KEY=value          # Set variable
scalingo --app my-app env                        # View all variables
scalingo --app my-app scale web:Standard-2X      # Change dyno size

# Domains & SSL
scalingo --app my-app domains-add example.com    # Add domain
scalingo --app my-app domains                    # List domains
scalingo --app my-app certs-add --cert-file ... --key-file ...  # Upload cert

# Debugging
scalingo --app my-app run bash                   # Run command
scalingo --app my-app ps                         # List processes
scalingo --app my-app restart                    # Restart app
```

---

**Last Updated**: 2024  
**Vite Version**: 5.x  
**React Version**: 18.x  
**Node.js**: 18+ recommended
