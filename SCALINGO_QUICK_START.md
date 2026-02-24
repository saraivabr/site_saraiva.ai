# Scalingo Deployment - Quick Start Guide

## One-Time Setup

```bash
# 1. Install Scalingo CLI
brew install scalingo

# 2. Login
scalingo login

# 3. Create app
scalingo create my-app

# 4. Set environment variables
scalingo --app my-app env-set \
  NODE_ENV=production \
  VITE_API_URL=https://api.example.com \
  VITE_SUPABASE_URL=https://project.supabase.co \
  VITE_SUPABASE_ANON_KEY=your-anon-key

# 5. Add custom domain
scalingo --app my-app domains-add example.com
scalingo --app my-app domains-add www.example.com
```

## Configure DNS

In your domain registrar, add CNAME records:

```
CNAME  www          my-app.scalingo.io
CNAME  example.com  my-app.scalingo.io
```

⏳ Wait 24-48 hours for DNS and SSL certificate generation.

## Deploy

```bash
git push scalingo main:main
```

## Verify

```bash
# Check status
scalingo --app my-app status

# View logs
scalingo --app my-app logs --follow

# Test app
curl -I https://example.com
```

## Common Commands

```bash
scalingo --app my-app logs                      # View logs
scalingo --app my-app env                       # View variables
scalingo --app my-app env-set KEY=value         # Set variable
scalingo --app my-app domains                   # List domains
scalingo --app my-app scale web:Standard-2X     # Change dyno size
scalingo --app my-app restart                   # Restart app
scalingo --app my-app run bash                  # Run command
```

## Files in this Repository

| File | Purpose |
|------|---------|
| `Procfile` | Process configuration (how to start the app) |
| `.buildpacks` | Build configuration (Node.js buildpack) |
| `scalingo.json` | App metadata and addon configuration |
| `.env.production.example` | Environment variables template |
| `server.js` | Express server with production optimizations |
| `docs/SCALINGO_DEPLOYMENT.md` | Complete deployment guide |

## Full Documentation

See `docs/SCALINGO_DEPLOYMENT.md` for:
- Detailed Procfile explanation
- All environment variables
- SSL/TLS certificate setup
- Performance optimization
- Troubleshooting guide
- Resource links

## Need Help?

1. Check logs: `scalingo --app my-app logs --follow`
2. Read full guide: `docs/SCALINGO_DEPLOYMENT.md`
3. Scalingo docs: https://doc.scalingo.com/
4. Support: support@scalingo.com
