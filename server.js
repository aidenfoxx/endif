const fs = require('fs');
const path = require('path');
const http = require('http');

const PORT = 8080;
const HOST = '127.0.0.1';
const PATH_BASE = path.resolve(`${process.cwd()}/public`);

const server = http.createServer(function (req, res) {
  if (req.url === '/') {
    res.writeHead(200);
    res.end(fs.readFileSync(`${PATH_BASE}/index.html`));
    return;
  }

  const filename = path.resolve(`${PATH_BASE}${req.url}`);

  if (fs.existsSync(filename)) {
    const extname = path.extname(filename);

    switch (extname) {
      case '.js':
        res.setHeader('Content-Type', 'text/javascript');
        break;
    }

    res.writeHead(200);
    res.end(fs.readFileSync(filename));
    return;
  }

  res.writeHead(404);
  res.end('');
});

server.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
