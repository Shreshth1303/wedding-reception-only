/**
 * Production-Ready Static & Fallback HTTP Server
 * The Wedding Reception of Jassim Hashim & Shifa Anis Khan
 * Zero external dependencies — built on native Node.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.wav': 'audio/wav',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.ics': 'text/calendar; charset=utf-8',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
  // Parse requested URL
  const parsedUrl = url.parse(req.url);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Normalize path & prevent directory traversal attacks
  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') {
    safePath = '/index.html';
  }

  const filePath = path.join(ROOT_DIR, safePath);

  // Ensure path is within ROOT_DIR
  if (!filePath.startsWith(ROOT_DIR)) {
    serve404(res);
    return;
  }

  // Check file status
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Nonexistent file / directory -> Return HTTP 404 with custom 404.html
      serve404(res);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const totalSize = stats.size;

    // Handle Range Requests (Essential for Audio seeking & streaming)
    const rangeHeader = req.headers.range;
    if (rangeHeader && (ext === '.mp3' || ext === '.ogg')) {
      const parts = rangeHeader.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1;

      if (start >= totalSize || end >= totalSize || start > end) {
        res.writeHead(416, { 'Content-Range': `bytes */${totalSize}` });
        res.end();
        return;
      }

      const chunkSize = end - start + 1;
      const fileStream = fs.createReadStream(filePath, { start, end });

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${totalSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400'
      });

      fileStream.pipe(res);
      return;
    }

    // Standard 200 OK File Delivery
    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': totalSize,
      'Accept-Ranges': 'bytes',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=86400'
    });

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  });
});

function serve404(res) {
  const custom404Path = path.join(ROOT_DIR, '404.html');
  fs.readFile(custom404Path, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }

    res.writeHead(404, {
      'Content-Type': 'text/html; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-cache'
    });
    res.end(content);
  });
}

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Celebration Invitation Server running at: http://localhost:${PORT}`);
    console.log(`- 404 fallback configured for nonexistent paths.`);
    console.log(`- Audio streaming & range requests enabled.`);
  });
}

module.exports = server;
