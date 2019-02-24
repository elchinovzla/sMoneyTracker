const fs = require('fs');
const http = require('http');
const app = require('./app');
const debug = require("debug")("node-angular");
const https = require('https');

var options = {
  key: fs.readFileSync('privatekey.pem'),
  cert: fs.readFileSync('certificate.pem')
};

const normalizePort = val => {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  } else if (port >= 0) {
    return port;
  }
  return false;
};

const onError = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof addr === 'string' ? 'pipe' + addr : 'port' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + port;
  debug('Listening on ' + bind);
};

const port = normalizePort(process.env.PORT || '3007');
app.set('port', port);

const server = http.createServer(app);
server.on('error', onError);
server.on('listening', onListening);
server.listen(port);

https.createServer(options, app).listen(3019);
