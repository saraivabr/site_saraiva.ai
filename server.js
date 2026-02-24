import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import compression from 'compression';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware: Logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - ${req.get('user-agent')?.substring(0, 40)}`);
  next();
});

// Middleware: HTTPS Redirect (for production)
if (NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.get('X-Forwarded-Proto') !== 'https' && process.env.FORCE_HTTPS !== 'false') {
      return res.redirect('https://' + req.get('Host') + req.url);
    }
    next();
  });
}

// Middleware: Security Headers
app.use((req, res, next) => {
  // HSTS: Force HTTPS for future requests
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Content Security Policy (permissive for SPA, adjust as needed)
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;");
  
  next();
});

// Middleware: Compression
app.use(compression({
  threshold: 1024, // Compress responses larger than 1KB
  level: 6, // Compression level (0-9)
  filter: (req, res) => {
    // Don't compress responses with no-gzip header
    if (req.headers['x-no-compression']) {
      return false;
    }
    // Use compression filter function
    return compression.filter(req, res);
  }
}));

// Middleware: Static Files with Cache Control
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath, {
  maxAge: NODE_ENV === 'production' ? '1d' : '0',
  etag: false,
  lastModified: false,
  setHeaders: (res, path) => {
    // Cache static assets with hash for 1 year
    if (/\.[a-f0-9]{8}\.(js|css|woff|woff2)$/i.test(path)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else {
      // Cache other assets for 1 hour
      res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
    }
  }
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes can be added here
// app.use('/api', apiRouter);

// SPA Fallback: Serve index.html for all unmatched routes
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      console.error('Error serving index.html:', err);
      res.status(500).send('Internal Server Error');
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: NODE_ENV === 'production' ? 'Internal Server Error' : err.message
  });
});

// Start server
const server = app.listen(PORT, HOST, () => {
  console.log(`
╔════════════════════════════════════════╗
║   Vite React SPA Server                 ║
╠════════════════════════════════════════╣
║ Environment:  ${NODE_ENV.padEnd(29)}║
║ Host:         ${HOST.padEnd(29)}║
║ Port:         ${String(PORT).padEnd(29)}║
║ Dist Path:    ${distPath.substring(distPath.length - 30).padEnd(29)}║
╚════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received: Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received: Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
