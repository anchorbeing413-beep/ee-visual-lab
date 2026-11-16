/**
 * ============================================================================
 * EE VISUAL LAB - ZERO-DEPENDENCY LOCAL SCIENTIFIC WEB SERVER
 * Run with: node serve.js (or double-click start-lab.bat)
 * ============================================================================
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 3000;
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/index.html';

  const filePath = path.join(__dirname, reqPath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found: ' + reqPath);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}/index.html`;
  console.log('================================================================');
  console.log('  EE VISUAL LAB LOCAL SERVER ACTIVE');
  console.log(`  Access URL: ${url}`);
  console.log('  Press Ctrl+C to stop the server.');
  console.log('================================================================');

  // Automatically open default browser on Windows
  const startCmd = process.platform === 'win32' ? `start ${url}` : `xdg-open ${url}`;
  exec(startCmd, (err) => {
    if (err) console.log(`Open your browser and navigate to: ${url}`);
  });
});
