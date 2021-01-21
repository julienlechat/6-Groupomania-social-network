// INCLUDE
const http = require('http');
const app = require('./app');

// DONNE UN PORT VALIDE
const validatePort = val => {
    const port = parseInt(val, 10);
    if (isNaN(port)) return val
    if (port >= 0) return port
    return false;
};
// GERE LES ERREURS
const errorHandler = error => {
    if (error.syscall !== 'listen') {
      throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? "l'adresse " + address : 'le port ' + port;
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges.');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use.');
        process.exit(1);
        break;
      default:
        throw error;
    }
};

// DEFINI UN PORT
const port = validatePort(process.env.PORT || '3000');

// ON DEFINI QUE NOTRE SERVEUR RENVOIE VERS 'app'
const server = http.createServer(app);

// ON CONTROLE LE SERVEUR
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? "adress " + address : 'port ' + port;
  console.log('Listening ' + bind);
});

// ON ECOUTE LES REQUETES AVEC LE PORT
server.listen(port);