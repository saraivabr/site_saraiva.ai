import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import compression from 'compression';
import Database from 'better-sqlite3';
import crypto from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware: JSON body parsing
app.use(express.json());

// Load all content data
const mcpData = JSON.parse(readFileSync(path.join(__dirname, 'data', 'mcps.json'), 'utf-8'));
const skillsData = JSON.parse(readFileSync(path.join(__dirname, 'data', 'skills.json'), 'utf-8'));
const agentsData = JSON.parse(readFileSync(path.join(__dirname, 'data', 'agents.json'), 'utf-8'));
const commandsData = JSON.parse(readFileSync(path.join(__dirname, 'data', 'commands.json'), 'utf-8'));
const hooksData = JSON.parse(readFileSync(path.join(__dirname, 'data', 'hooks.json'), 'utf-8'));
const settingsData = JSON.parse(readFileSync(path.join(__dirname, 'data', 'settings.json'), 'utf-8'));

const allData = {
  mcps: mcpData,
  skills: skillsData,
  agents: agentsData,
  commands: commandsData,
  hooks: hooksData,
  settings: settingsData,
};

// ─── Database Setup ─────────────────────────────────────────────────
const db = new Database(path.join(__dirname, 'data', 'saraiva.db'));
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    github_id TEXT UNIQUE NOT NULL,
    username TEXT NOT NULL,
    name TEXT,
    email TEXT,
    avatar_url TEXT,
    plan TEXT DEFAULT 'free',
    plan_expires_at TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS saved_stacks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    name TEXT NOT NULL,
    items_json TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    woovi_charge_id TEXT,
    woovi_correlation_id TEXT,
    status TEXT DEFAULT 'pending',
    amount INTEGER NOT NULL,
    plan TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

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
  
  // Content Security Policy (permissive for SPA)
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://plausible.io; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.woovi.com https://plausible.io;");
  
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

// Middleware: Cookie parser
app.use((req, res, next) => {
  req.cookies = {};
  const cookieHeader = req.get('Cookie');
  if (cookieHeader) {
    cookieHeader.split(';').forEach(cookie => {
      const [name, ...rest] = cookie.trim().split('=');
      req.cookies[name] = decodeURIComponent(rest.join('='));
    });
  }
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Legacy route redirects
app.get('/mcps', (req, res) => res.redirect(301, '/directory/mcps'));
app.get('/mcps/:slug', (req, res) => res.redirect(301, `/directory/mcps/${req.params.slug}`));
app.get('/templates', (req, res) => res.redirect(301, '/directory/commands'));
app.get('/templates/:slug', (req, res) => res.redirect(301, `/directory/commands/${req.params.slug}`));
app.get('/explore', (req, res) => res.redirect(301, '/directory/skills'));

// ─── GitHub OAuth Configuration ─────────────────────────────────────
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || '';
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || '';
const GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL || 'https://saraiva.ai/api/auth/github/callback';
const SESSION_SECRET = process.env.SESSION_SECRET || 'saraiva-ai-dev-secret';

function createSessionToken(userId) {
  const payload = JSON.stringify({ userId, exp: Date.now() + 30 * 24 * 60 * 60 * 1000 });
  const hmac = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');
  return Buffer.from(payload).toString('base64') + '.' + hmac;
}

function verifySessionToken(token) {
  if (!token) return null;
  const [payloadB64, hmac] = token.split('.');
  if (!payloadB64 || !hmac) return null;
  const payload = Buffer.from(payloadB64, 'base64').toString();
  const expected = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');
  if (hmac !== expected) return null;
  const data = JSON.parse(payload);
  if (data.exp < Date.now()) return null;
  return data;
}

function getUser(req) {
  const token = req.cookies?.session;
  const session = verifySessionToken(token);
  if (!session) return null;
  return db.prepare('SELECT * FROM users WHERE id = ?').get(session.userId);
}

// Auth: Start GitHub OAuth
app.get('/api/auth/github', (req, res) => {
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: GITHUB_CALLBACK_URL,
    scope: 'read:user user:email',
  });
  res.redirect(`https://github.com/login/oauth/authorize?${params}`);
});

// Auth: GitHub OAuth Callback
app.get('/api/auth/github/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.redirect('/?error=no_code');

  try {
    // Exchange code for token
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
      }),
    });
    const { access_token } = await tokenRes.json();
    if (!access_token) return res.redirect('/?error=no_token');

    // Get user info
    const userRes = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const ghUser = await userRes.json();

    // Upsert user
    const existing = db.prepare('SELECT * FROM users WHERE github_id = ?').get(String(ghUser.id));
    let userId;
    if (existing) {
      db.prepare('UPDATE users SET username = ?, name = ?, avatar_url = ?, updated_at = datetime("now") WHERE id = ?')
        .run(ghUser.login, ghUser.name, ghUser.avatar_url, existing.id);
      userId = existing.id;
    } else {
      const result = db.prepare('INSERT INTO users (github_id, username, name, email, avatar_url) VALUES (?, ?, ?, ?, ?)')
        .run(String(ghUser.id), ghUser.login, ghUser.name, ghUser.email, ghUser.avatar_url);
      userId = result.lastInsertRowid;
    }

    // Set session cookie
    const token = createSessionToken(userId);
    res.cookie('session', token, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.redirect('/');
  } catch (err) {
    console.error('OAuth error:', err);
    res.redirect('/?error=auth_failed');
  }
});

// Auth: Get current user
app.get('/api/auth/me', (req, res) => {
  const user = getUser(req);
  if (!user) return res.json({ user: null });
  const { id, username, name, avatar_url, plan, plan_expires_at } = user;
  res.json({ user: { id, username, name, avatar_url, plan, plan_expires_at } });
});

// Auth: Logout
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('session');
  res.json({ ok: true });
});

// ─── Saved Stacks (requires auth) ──────────────────────────────────
app.get('/api/stacks', (req, res) => {
  const user = getUser(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });
  if (user.plan === 'free') return res.status(403).json({ error: 'Pro plan required' });
  const stacks = db.prepare('SELECT * FROM saved_stacks WHERE user_id = ? ORDER BY updated_at DESC').all(user.id);
  res.json(stacks.map(s => ({ ...s, items: JSON.parse(s.items_json) })));
});

app.post('/api/stacks', (req, res) => {
  const user = getUser(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });
  if (user.plan === 'free') return res.status(403).json({ error: 'Pro plan required' });
  const { name, items } = req.body;
  if (!name || !items) return res.status(400).json({ error: 'Missing name or items' });
  const result = db.prepare('INSERT INTO saved_stacks (user_id, name, items_json) VALUES (?, ?, ?)')
    .run(user.id, name, JSON.stringify(items));
  res.json({ id: result.lastInsertRowid });
});

app.delete('/api/stacks/:id', (req, res) => {
  const user = getUser(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });
  db.prepare('DELETE FROM saved_stacks WHERE id = ? AND user_id = ?').run(req.params.id, user.id);
  res.json({ ok: true });
});

// ─── Woovi Payment Integration ──────────────────────────────────────
const WOOVI_API_KEY = process.env.WOOVI_API_KEY || '';

// Create Pix charge
app.post('/api/checkout', async (req, res) => {
  const user = getUser(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });

  const { plan } = req.body;
  const amounts = { pro: 2900, teams: 7900 }; // in cents
  const amount = amounts[plan];
  if (!amount) return res.status(400).json({ error: 'Invalid plan' });

  try {
    const correlationID = crypto.randomUUID();
    const wooviRes = await fetch('https://api.woovi.com/api/v1/charge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: WOOVI_API_KEY,
      },
      body: JSON.stringify({
        correlationID,
        value: amount,
        comment: `Saraiva.AI ${plan === 'pro' ? 'Pro' : 'Teams'} - ${user.username}`,
      }),
    });
    const charge = await wooviRes.json();

    // Save payment record
    db.prepare('INSERT INTO payments (user_id, woovi_charge_id, woovi_correlation_id, amount, plan) VALUES (?, ?, ?, ?, ?)')
      .run(user.id, charge.charge?.id || '', correlationID, amount, plan);

    res.json({
      qrCode: charge.charge?.qrCodeImage,
      brCode: charge.charge?.brCode,
      correlationID,
    });
  } catch (err) {
    console.error('Woovi checkout error:', err);
    res.status(500).json({ error: 'Payment creation failed' });
  }
});

// Woovi webhook - payment confirmed
app.post('/api/webhooks/woovi', (req, res) => {
  const { event, charge } = req.body;

  if (event === 'OPENPIX:CHARGE_COMPLETED' && charge?.correlationID) {
    const payment = db.prepare('SELECT * FROM payments WHERE woovi_correlation_id = ?').get(charge.correlationID);
    if (payment) {
      // Update payment status
      db.prepare('UPDATE payments SET status = ?, woovi_charge_id = ? WHERE id = ?')
        .run('completed', charge.id || '', payment.id);

      // Activate plan (30 days)
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      db.prepare('UPDATE users SET plan = ?, plan_expires_at = ?, updated_at = datetime("now") WHERE id = ?')
        .run(payment.plan, expiresAt, payment.user_id);

      console.log(`Plan ${payment.plan} activated for user ${payment.user_id}`);
    }
  }

  res.json({ ok: true });
});

// Check subscription status
app.get('/api/subscription', (req, res) => {
  const user = getUser(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });

  const isActive = user.plan !== 'free' && (!user.plan_expires_at || new Date(user.plan_expires_at) > new Date());
  res.json({
    plan: isActive ? user.plan : 'free',
    expiresAt: user.plan_expires_at,
    active: isActive,
  });
});

// API: Get stats for all content types
app.get('/api/stats', (req, res) => {
  res.json(Object.fromEntries(
    Object.entries(allData).map(([type, data]) => [type, data.filter(i => i.published !== false).length])
  ));
});

// API: List items by type
app.get('/api/:type', (req, res) => {
  const data = allData[req.params.type];
  if (!data) return res.status(404).json({ error: 'Type not found' });

  let results = data.filter(i => i.published !== false);

  if (req.query.category && req.query.category !== 'all') {
    results = results.filter(i => i.category === req.query.category);
  }
  if (req.query.deploy_type && req.query.deploy_type !== 'all') {
    results = results.filter(i => i.deploy_type === req.query.deploy_type);
  }
  if (req.query.search) {
    const s = req.query.search.toLowerCase();
    results = results.filter(i =>
      (i.name && i.name.toLowerCase().includes(s)) ||
      (i.description && i.description.toLowerCase().includes(s)) ||
      (i.description_pt && i.description_pt.toLowerCase().includes(s))
    );
  }

  // Sort: featured first, then by usage_count or name
  results.sort((a, b) => {
    if (a.featured !== b.featured) return b.featured ? 1 : -1;
    if (a.usage_count !== undefined && b.usage_count !== undefined) return b.usage_count - a.usage_count;
    return (a.name || '').localeCompare(b.name || '');
  });

  res.json(results);
});

// API: Get single item by type and slug
app.get('/api/:type/:slug', (req, res) => {
  const data = allData[req.params.type];
  if (!data) return res.status(404).json({ error: 'Type not found' });

  const item = data.find(i => i.slug === req.params.slug && i.published !== false);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  res.json(item);
});

// API: Generate install command for stack
app.post('/api/stack/generate', (req, res) => {
  const { items } = req.body; // Array of { type, slug }
  if (!items || !Array.isArray(items)) return res.status(400).json({ error: 'Invalid request' });

  const parts = [];
  for (const { type, slug } of items) {
    const data = allData[type];
    if (!data) continue;
    const item = data.find(i => i.slug === slug);
    if (item && item.install_command) {
      parts.push({ type, name: item.name, command: item.install_command });
    }
  }

  res.json({ items: parts });
});

// SPA Fallback: Serve index.html for all unmatched routes
app.get('{*path}', (req, res) => {
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
    db.close();
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received: Shutting down gracefully...');
  server.close(() => {
    db.close();
    console.log('Server closed');
    process.exit(0);
  });
});
