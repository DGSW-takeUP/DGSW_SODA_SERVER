// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();

const HTTP = require('http');
const HTTPS = require('https');
const path = require('path');
const express = require('express');
const cors = require('cors');
const fs = require('fs');
// eslint-disable-next-line import/no-extraneous-dependencies
const colors = require('colors');
const cacheControl = require('express-cache-controller');
const override = require('method-override');
const compression = require('compression');
const colorConsole = require('./lib/log');
const api = require('./api');

const { PORT: port } = process.env;
const { SSLPORT: sslport } = process.env;


const app = express();
const server = HTTP.createServer(app);

// middleware
app.use('/image', express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(express.json());
app.use(override());
app.use(compression());
app.use(cacheControl({
  maxAge: 0,
}));

// api router
app.use('/', api);

server.listen(port, () => {
  colorConsole.success(`[HTTP] Soda Server is started on port ${colors.cyan(port)}`);
});

try {
  const option = {
    ca: fs.readFileSync('/etc/letsencrypt/live/takeup.co.kr/fullchain.pem'),
    key: fs.readFileSync(path.resolve(process.cwd(), '/etc/letsencrypt/live/takeup.co.kr/privkey.pem'), 'utf8').toString(),
    cert: fs.readFileSync(path.resolve(process.cwd(), '/etc/letsencrypt/live/takeup.co.kr/cert.pem'), 'utf8').toString(),
  };

  HTTPS.createServer(option, app).listen(sslport, () => {
    colorConsole.success(`[HTTPS] Soda Server is started on port ${colors.cyan(sslport)}`);
  });
} catch (error) {
  colorConsole.error('[HTTPS] HTTPS 오류가 발생하였습니다. HTTPS 서버는 실행되지 않습니다.');
  colorConsole.warn(error);
}
