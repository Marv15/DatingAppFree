// Zero-dependency local development server for Dating App Free
// Works on Windows, macOS, and Linux using built-in Node.js modules.

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');

const PORT = process.env.PORT || 8080;
const ROOT_DIR = __dirname;

// MIME types
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.webmanifest': 'application/manifest+json; charset=UTF-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=UTF-8'
};

// Helper: Get local IPv4 address
function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  const prioritized = [];
  const fallbacks = [];

  for (const name of Object.keys(interfaces)) {
    const isVirtual = name.toLowerCase().includes('vethernet') || 
                      name.toLowerCase().includes('virtual') || 
                      name.toLowerCase().includes('docker') ||
                      name.toLowerCase().includes('loopback') ||
                      name.toLowerCase().includes('default switch');

    for (const iface of interfaces[name]) {
      // Skip loopback, IPv6, and APIPA link-local 169.254.x.x
      if (iface.family === 'IPv4' && !iface.internal && !iface.address.startsWith('169.254.')) {
        if (!isVirtual && (iface.address.startsWith('192.168.') || iface.address.startsWith('10.'))) {
          prioritized.push(iface.address);
        } else if (!isVirtual) {
          prioritized.push(iface.address);
        } else {
          fallbacks.push(iface.address);
        }
      }
    }
  }

  return prioritized[0] || fallbacks[0] || '127.0.0.1';
}

const localIp = getLocalIpAddress();
const localUrl = `http://localhost:${PORT}`;
const phoneUrl = `http://${localIp}:${PORT}`;

const server = http.createServer((req, res) => {
  // Normalize URL
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  let pathname = parsedUrl.pathname;

  // API endpoint to give the frontend its local IP & connection URLs
  if (pathname === '/api/info') {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify({
      localIp,
      port: PORT,
      localUrl,
      phoneUrl
    }));
    return;
  }

  // Static file serving
  if (pathname === '/') {
    pathname = '/index.html';
  }

  // Prevent directory traversal
  const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(ROOT_DIR, safePath);

  // Check if file exists
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache', // Allow easy updating during local development
      'Access-Control-Allow-Origin': '*'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('\n=============================================================');
  console.log('       🕊️  Dating App Free · Local Server Ready');
  console.log('=============================================================');
  console.log(`  🖥️  On this Computer:   ${localUrl}`);
  console.log(`  📱  On your iPhone:     ${phoneUrl}`);
  console.log('=============================================================');
  console.log('  👉 Ensure your iPhone is on the SAME Wi-Fi network.');
  console.log('  👉 Scan the QR code inside the app or type the URL above in Safari.');
  console.log('  👉 In Safari: Tap Share -> "Add to Home Screen".');
  console.log('=============================================================\n');

  // Auto-open browser on Windows / Mac / Linux
  const openCmd = process.platform === 'win32' ? `start ${localUrl}` :
                  process.platform === 'darwin' ? `open ${localUrl}` : `xdg-open ${localUrl}`;
  exec(openCmd, (err) => {
    // Ignore error if cannot auto-open browser in headless mode
  });
});
