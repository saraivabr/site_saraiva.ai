# Docker Compose Services - Documentation

This document describes the auxiliary services stack for the Saraiva Site project.

## Services Overview

### 1. **Redis** (Cache Layer)
- **Image**: `redis:7-alpine`
- **Port**: `6379`
- **Purpose**: In-memory data store for caching, sessions, and real-time features
- **Features**:
  - Password-protected access
  - AOF (Append-Only File) persistence
  - Health checks enabled
  - Isolated network connectivity

**Configuration**:
- Auth: `redis_password_change_me` (CHANGE IN PRODUCTION)
- Persistence: `/data/redis` (mounted volume)
- Restart Policy: `unless-stopped`

### 2. **Meilisearch** (Search Engine)
- **Image**: `getmeili/meilisearch:v1.8`
- **Port**: `7700`
- **Purpose**: Full-text search engine with REST API
- **Features**:
  - Master key authentication
  - Production mode
  - Analytics disabled
  - Health checks enabled
  - RESTful API

**Configuration**:
- Master Key: `meilisearch_key_change_me` (CHANGE IN PRODUCTION)
- Environment: Production
- Persistence: `/data/meilisearch` (mounted volume)
- Restart Policy: `unless-stopped`

**API Endpoints**:
- Health: `http://localhost:7700/health`
- Indexes: `http://localhost:7700/indexes`
- Search: `http://localhost:7700/indexes/{index_uid}/search`

### 3. **Redis Commander** (UI)
- **Image**: `rediscommander/redis-commander:latest`
- **Port**: `8081`
- **Purpose**: Web-based Redis management interface
- **Features**:
  - Visual Redis data browser
  - Key management
  - Value inspection
  - Command execution

**Configuration**:
- Accessible via: `http://localhost:8081`
- Via Nginx proxy: `http://localhost/redis-commander/`
- Auto-connects to Redis service

### 4. **Nginx** (Reverse Proxy)
- **Image**: `nginx:alpine`
- **Ports**: `80` (HTTP), `443` (HTTPS - optional)
- **Purpose**: Reverse proxy and load balancer
- **Features**:
  - Request routing to backend services
  - Security headers
  - Rate limiting
  - Gzip compression
  - Request/response logging

**Configuration**:
- Config: `config/nginx.conf`
- Logs: `logs/nginx/`

## Network Architecture

All services are connected via a custom Docker bridge network:
- **Network Name**: `app_network`
- **Driver**: bridge
- **Subnet**: `172.20.0.0/16`
- **Bridge Name**: `app_bridge0`

This ensures services can communicate internally while being isolated from the host network.

## Health Checks

All services include health checks:

```
Redis:           redis-cli incr ping (10s interval)
Meilisearch:     curl http://localhost:7700/health (10s interval)
Redis Commander: curl http://localhost:8081/ (10s interval)
Nginx:           curl http://localhost/health (10s interval)
```

Health checks help Docker automatically restart failed services and ensure service readiness.

## Persistent Volumes

All data is persisted to avoid data loss on container restarts:

| Service | Mount Path | Host Path | Purpose |
|---------|-----------|----------|---------|
| Redis | `/data` | `./data/redis` | Cache data |
| Meilisearch | `/meili_data` | `./data/meilisearch` | Search indexes |
| Nginx | `/var/log/nginx` | `./logs/nginx` | Access & error logs |

## Getting Started

### Prerequisites
- Docker Desktop or Docker Engine 20.10+
- Docker Compose 1.29+

### Quickstart

1. **Start services**:
   ```bash
   ./scripts/docker-services.sh up
   ```

2. **Check status**:
   ```bash
   ./scripts/docker-services.sh status
   ```

3. **View logs**:
   ```bash
   ./scripts/docker-services.sh logs
   ```

4. **Access services**:
   - Redis Commander UI: http://localhost:8081
   - Meilisearch API: http://localhost:7700
   - Via Nginx proxy: http://localhost/search

### Management Commands

The `scripts/docker-services.sh` script provides convenient commands:

```bash
# Start services
./scripts/docker-services.sh up

# Stop services (keeps data)
./scripts/docker-services.sh down

# Restart specific service
./scripts/docker-services.sh restart redis

# View logs for all services
./scripts/docker-services.sh logs

# View logs for specific service
./scripts/docker-services.sh logs meilisearch

# Check service status
./scripts/docker-services.sh status

# Open shell in service
./scripts/docker-services.sh shell redis

# Clean everything (removes containers, volumes, data)
./scripts/docker-services.sh clean

# Build images
./scripts/docker-services.sh build
```

### Direct Docker Compose Commands

```bash
# Start services in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Execute command in service
docker-compose exec redis redis-cli

# View service status
docker-compose ps

# Restart specific service
docker-compose restart redis
```

## Configuration

### Environment Variables

Configuration is managed via `.env.docker`:

```env
REDIS_PASSWORD=redis_password_change_me
MEILI_MASTER_KEY=meilisearch_key_change_me
MEILI_ENV=production
```

### Redis Configuration

Connect to Redis in your application:

```javascript
// Node.js example with ioredis
const Redis = require('ioredis');

const redis = new Redis({
  host: 'localhost',  // 'redis' in Docker network
  port: 6379,
  password: 'redis_password_change_me',
});
```

### Meilisearch Configuration

Interact with Meilisearch API:

```javascript
// Node.js example with @meilisearch/sdk
const { MeiliSearch } = require('@meilisearch/sdk');

const client = new MeiliSearch({
  host: 'http://localhost:7700',
  apiKey: 'meilisearch_key_change_me',
});

// Create index
const index = await client.createIndex('products');

// Add documents
await index.addDocuments([
  { id: 1, name: 'Product 1', price: 100 },
  { id: 2, name: 'Product 2', price: 200 },
]);

// Search
const results = await index.search('product');
```

## Development vs Production

### Development Setup

Use `docker-compose.override.yml` for development overrides:

```bash
# Automatically loaded alongside docker-compose.yml
docker-compose up -d
```

Development features:
- Simpler passwords (easier testing)
- Analytics enabled
- More verbose logging

### Production Setup

For production deployment:

1. **Update `.env.docker` with strong credentials**:
   ```env
   REDIS_PASSWORD=$(openssl rand -base64 32)
   MEILI_MASTER_KEY=$(openssl rand -base64 32)
   ```

2. **Configure SSL/TLS** in Nginx:
   - Place certificates in `config/ssl/`
   - Update `config/nginx.conf` to enable HTTPS

3. **Adjust resource limits**:
   ```yaml
   services:
     redis:
       deploy:
         resources:
           limits:
             cpus: '2'
             memory: 2G
           reservations:
             cpus: '1'
             memory: 1G
   ```

4. **Use production image tags**:
   ```yaml
   redis: redis:7.0-alpine  # Pin specific version
   meilisearch: getmeili/meilisearch:v1.8
   ```

## Troubleshooting

### Service won't start

Check logs:
```bash
docker-compose logs redis
docker-compose logs meilisearch
```

### Health check failing

```bash
# Check service logs
docker-compose logs --tail=50 service_name

# Test connectivity
docker-compose exec nginx curl http://redis:6379
```

### High memory usage

Limit memory per service in `docker-compose.yml`:

```yaml
redis:
  deploy:
    resources:
      limits:
        memory: 1G
```

### Permission denied on volumes

```bash
# Fix volume permissions
sudo chown -R 1000:1000 ./data
chmod -R 755 ./data
```

### Port conflicts

If ports are already in use:

```bash
# Find process using port
lsof -i :6379

# Change port in docker-compose.yml
ports:
  - "6380:6379"  # Host port : Container port
```

## Security Considerations

### Default Credentials
⚠️ **IMPORTANT**: Change default passwords before production use:

1. Generate secure passwords:
   ```bash
   openssl rand -base64 32
   ```

2. Update `.env.docker`:
   ```env
   REDIS_PASSWORD=<generated_secure_password>
   MEILI_MASTER_KEY=<generated_secure_key>
   ```

3. Rebuild containers:
   ```bash
   docker-compose down -v
   docker-compose up -d
   ```

### Network Security
- Services are isolated on `app_network`
- No services exposed to host network except via Nginx
- Configure firewall rules for production

### SSL/TLS
1. Place certificates in `config/ssl/`
2. Enable HTTPS in `config/nginx.conf`
3. Use strong cipher suites

## Monitoring & Logging

### Log Files

```bash
# View Nginx logs
tail -f logs/nginx/access.log
tail -f logs/nginx/error.log

# View Docker logs
docker-compose logs -f redis
docker-compose logs -f meilisearch
```

### Metrics

Monitor resource usage:

```bash
# Docker stats
docker stats

# Service-specific stats
docker stats app_redis app_meilisearch
```

## Backup & Recovery

### Backup Data

```bash
# Backup Redis data
docker-compose exec redis redis-cli BGSAVE
cp -r data/redis data/redis.backup

# Backup Meilisearch data
cp -r data/meilisearch data/meilisearch.backup
```

### Recovery

```bash
# Restore from backup
rm -rf data/redis data/meilisearch
cp -r data/redis.backup data/redis
cp -r data/meilisearch.backup data/meilisearch

# Restart services
docker-compose restart redis meilisearch
```

## Performance Optimization

### Redis Performance

```bash
# Monitor commands
docker-compose exec redis redis-cli --stat

# Check memory usage
docker-compose exec redis redis-cli INFO memory

# Clear cache (dangerous in production!)
docker-compose exec redis redis-cli FLUSHDB
```

### Meilisearch Performance

```bash
# Check index stats
curl http://localhost:7700/indexes/products/stats

# Monitor indexing
curl http://localhost:7700/tasks
```

## Integration Examples

### Node.js/Express

```javascript
const express = require('express');
const Redis = require('ioredis');
const { MeiliSearch } = require('@meilisearch/sdk');

const app = express();

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
});

const meili = new MeiliSearch({
  host: `http://${process.env.MEILI_HOST || 'localhost'}:${process.env.MEILI_PORT || 7700}`,
  apiKey: process.env.MEILI_MASTER_KEY,
});

// Cache middleware
app.use(async (req, res, next) => {
  const cached = await redis.get(req.path);
  if (cached) return res.json(JSON.parse(cached));
  next();
});
```

### Python/FastAPI

```python
import redis
import aiohttp
from meilisearch import Client

redis_client = redis.Redis(
    host='localhost',
    port=6379,
    password='redis_password_change_me',
    decode_responses=True
)

meili_client = Client('http://localhost:7700', 'meilisearch_key_change_me')

# Use in FastAPI handlers
@app.get("/search")
async def search(q: str):
    cached = redis_client.get(f"search:{q}")
    if cached:
        return json.loads(cached)
    
    results = meili_client.index('products').search(q)
    redis_client.setex(f"search:{q}", 3600, json.dumps(results))
    return results
```

## References

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Redis Documentation](https://redis.io/documentation)
- [Meilisearch Documentation](https://docs.meilisearch.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Redis Commander GitHub](https://github.com/joeferner/redis-commander)

## Support

For issues or questions:
1. Check logs: `./scripts/docker-services.sh logs`
2. Review troubleshooting section above
3. Check official documentation links
4. Open GitHub issue with logs and configuration

## License

This Docker Compose configuration is part of the Saraiva Site project.
