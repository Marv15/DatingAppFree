// Zero-dependency local development server for Dating App Free
// Works on Windows, macOS, and Linux using built-in Node.js modules.

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { exec } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const PORT = process.env.PORT || 8080;
const ROOT_DIR = path.dirname(fileURLToPath(import.meta.url));

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
function getNetworkAddresses() {
  const interfaces = os.networkInterfaces();
  const lanIps = [];
  const vpnIps = [];
  const fallbacks = [];

  for (const name of Object.keys(interfaces)) {
    const lowerName = name.toLowerCase();
    const isVpnOrVirtual = lowerName.includes('vethernet') || 
                          lowerName.includes('virtual') || 
                          lowerName.includes('docker') || 
                          lowerName.includes('loopback') || 
                          lowerName.includes('default switch') ||
                          lowerName.includes('tailscale') ||
                          lowerName.includes('wireguard') ||
                          lowerName.includes('zerotier') ||
                          lowerName.includes('wsl');

    for (const iface of interfaces[name]) {
      // Skip loopback, IPv6, and APIPA link-local 169.254.x.x
      if (iface.family === 'IPv4' && !iface.internal && !iface.address.startsWith('169.254.')) {
        const addr = iface.address;
        const isTailscale = addr.startsWith('100.') || lowerName.includes('tailscale');

        if (!isVpnOrVirtual && !isTailscale) {
          if (addr.startsWith('192.168.') || addr.startsWith('10.')) {
            lanIps.unshift(addr); // Top priority: typical home Wi-Fi
          } else {
            lanIps.push(addr);
          }
        } else if (isTailscale) {
          vpnIps.push(addr);
        } else {
          fallbacks.push(addr);
        }
      }
    }
  }

  const primaryIp = lanIps[0] || vpnIps[0] || fallbacks[0] || '127.0.0.1';
  const tailscaleIp = vpnIps[0] || null;

  return { primaryIp, tailscaleIp };
}

const { primaryIp: localIp, tailscaleIp } = getNetworkAddresses();
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
  if (tailscaleIp) {
    console.log(`  🔒  Via Tailscale VPN:  http://${tailscaleIp}:${PORT}`);
  }
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
