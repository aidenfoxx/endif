const fs = require('fs');
const path = require('path');
const http = require('http');
const zlib = require('node:zlib');

const PORT = 8080;
const HOST = '127.0.0.1';
const PATH_BASE = path.resolve(`${process.cwd()}/public`);

const server = http.createServer(function (req, res) {
  let fileStream;

  if (req.url === '/') {
    fileStream = fs.createReadStream(`${PATH_BASE}/index.html`);
  } else {
    const fileName = path.resolve(`${PATH_BASE}${req.url}`);

    if (fs.existsSync(fileName)) {
      const extname = path.extname(fileName);

      switch (extname) {
        case '.js':
          res.setHeader('Content-Type', 'text/javascript');
          break;

        case '.jpg':
        case '.jpeg':
          res.setHeader('Content-Type', 'image/jpeg');
          break;

        case '.png':
          res.setHeader('Content-Type', 'image/png');
          break;

        case '.gltf':
          res.setHeader('Content-Type', 'model/gltf+json');
          break;
      }

      fileStream = fs.createReadStream(fileName);
    }
  }

  if (!fileStream) {
    res.writeHead(404);
    res.end();
    return;
  }

  var acceptEncoding = req.headers['accept-encoding'];

  if (acceptEncoding?.match(/\bgzip\b/)) {
    res.writeHead(200, { 'Content-Encoding': 'gzip' });
    fileStream.pipe(zlib.createGzip()).pipe(res);
  } else {
    res.writeHead(200);
    fileStream.pipe(res);
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
