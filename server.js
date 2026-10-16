/**
 * Production Server for YOU & ME Web App
 * Built with native Node.js (zero external dependencies).
 * Serves the production build from dist/ and provides /api endpoints
 * for surprise short links and Love Loop response delivery across separate devices.
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const DIST_DIR = path.resolve(__dirname, 'dist');
const DATA_DIR = path.resolve(__dirname, '.data');
const SURPRISES_FILE = path.resolve(DATA_DIR, 'surprises.json');
const RESPONSES_FILE = path.resolve(DATA_DIR, 'responses.json');

// Ensure storage files exist
function ensureStorage() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(SURPRISES_FILE)) {
    fs.writeFileSync(SURPRISES_FILE, JSON.stringify({}), 'utf-8');
  }
  if (!fs.existsSync(RESPONSES_FILE)) {
    fs.writeFileSync(RESPONSES_FILE, JSON.stringify([]), 'utf-8');
  }
}

ensureStorage();

function readSurprises() {
  try {
    ensureStorage();
    const raw = fs.readFileSync(SURPRISES_FILE, 'utf-8');
    return JSON.parse(raw || '{}');
  } catch {
    return {};
  }
}

function writeSurprises(data) {
  try {
    ensureStorage();
    fs.writeFileSync(SURPRISES_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write surprises:', err);
  }
}

function readResponses() {
  try {
    ensureStorage();
    const raw = fs.readFileSync(RESPONSES_FILE, 'utf-8');
    return JSON.parse(raw || '[]');
  } catch {
    return [];
  }
}

function writeResponses(data) {
  try {
    ensureStorage();
    fs.writeFileSync(RESPONSES_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write responses:', err);
  }
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
  // Global CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // 1. API: Health Check
  if (pathname === '/api/health' && req.method === 'GET') {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify({ status: 'ok', time: new Date().toISOString() }));
    return;
  }

  // 2. API: Surprises Collection (POST /api/surprises)
  if (pathname === '/api/surprises' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      // Protect against overly huge requests (> 10MB)
      if (body.length > 10 * 1024 * 1024) {
        res.statusCode = 413;
        res.end(JSON.stringify({ error: 'Payload too large' }));
        req.destroy();
      }
    });

    req.on('end', () => {
      try {
        const surprise = JSON.parse(body);
        if (!surprise || !surprise.id) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Invalid surprise payload: missing id' }));
          return;
        }

        const surprises = readSurprises();
        surprises[surprise.id] = surprise;
        writeSurprises(surprises);

        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: true, id: surprise.id }));
      } catch {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Malformed JSON payload' }));
      }
    });
    return;
  }

  // 3. API: Single Surprise Lookup (GET /api/surprises/:id)
  if (pathname.startsWith('/api/surprises/') && req.method === 'GET') {
    const id = decodeURIComponent(pathname.replace('/api/surprises/', ''));
    const surprises = readSurprises();
    const found = surprises[id];

    res.setHeader('Content-Type', 'application/json');
    if (found) {
      res.statusCode = 200;
      res.end(JSON.stringify(found));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: 'Surprise not found' }));
    }
    return;
  }

  // 4. API: Responses Collection (GET & POST /api/responses)
  if (pathname === '/api/responses') {
    if (req.method === 'GET') {
      const list = readResponses();
      const momentId = parsedUrl.searchParams.get('momentId') || parsedUrl.searchParams.get('surpriseId');
      const filtered = momentId ? list.filter((r) => r.momentId === momentId || r.surpriseId === momentId) : list;
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify(filtered));
      return;
    }

    if (req.method === 'POST') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });

      req.on('end', () => {
        try {
          const response = JSON.parse(body);
          if (!response || !response.id) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Invalid response payload' }));
            return;
          }

          const responses = readResponses();
          const updated = [response, ...responses.filter((r) => r.id !== response.id)];
          writeResponses(updated);

          res.statusCode = 201;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, item: response }));
        } catch {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Malformed JSON payload' }));
        }
      });
      return;
    }
  }

  // 4b. API: Audio Upload (POST /api/upload-audio)
  if (pathname === '/api/upload-audio' && req.method === 'POST') {
    const chunks = [];
    req.on('data', (chunk) => {
      chunks.push(chunk);
    });

    req.on('end', () => {
      try {
        const fullBuffer = Buffer.concat(chunks);
        if (fullBuffer.length === 0) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Empty audio buffer' }));
          return;
        }

        const mediaDir = path.resolve(DATA_DIR, 'media');
        if (!fs.existsSync(mediaDir)) {
          fs.mkdirSync(mediaDir, { recursive: true });
        }

        const filename = `audio_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.webm`;
        const filePath = path.resolve(mediaDir, filename);
        fs.writeFileSync(filePath, fullBuffer);

        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: true, url: `/api/media/${filename}` }));
      } catch (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Failed to save audio file' }));
      }
    });
    return;
  }

  // 4c. API: Serve Media (GET /api/media/:filename)
  if (pathname.startsWith('/api/media/') && (req.method === 'GET' || req.method === 'HEAD')) {
    const filename = path.basename(pathname.replace('/api/media/', ''));
    const mediaDir = path.resolve(DATA_DIR, 'media');
    const filePath = path.resolve(mediaDir, filename);

    if (fs.existsSync(filePath)) {
      const stat = fs.statSync(filePath);
      res.setHeader('Content-Type', 'audio/webm');
      res.setHeader('Content-Length', stat.size);
      res.setHeader('Accept-Ranges', 'bytes');
      fs.createReadStream(filePath).pipe(res);
      return;
    } else {
      res.statusCode = 404;
      res.end('Media not found');
      return;
    }
  }

  // 5. Static File Serving from dist/
  if (req.method === 'GET' || req.method === 'HEAD') {
    let filePath = path.join(DIST_DIR, pathname);

    // Prevent directory traversal attacks
    if (!filePath.startsWith(DIST_DIR)) {
      res.statusCode = 403;
      res.end('Forbidden');
      return;
    }

    // If directory requested or file does not exist, serve index.html (SPA Fallback)
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(DIST_DIR, 'index.html');
    }

    if (fs.existsSync(filePath)) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.setHeader('Content-Type', contentType);

      // Caching: long cache for hashed assets, no-cache for index.html
      if (pathname.startsWith('/assets/')) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else {
        res.setHeader('Cache-Control', 'no-cache');
      }

      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
      return;
    }
  }

  // Default fallback 404
  res.statusCode = 404;
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`[YOU & ME] Production Server running at http://localhost:${PORT}`);
  console.log(`[YOU & ME] Serving static files from: ${DIST_DIR}`);
});
