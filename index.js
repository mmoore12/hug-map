const app = require('./app');
const config = require('./config');

console.log('Listening on port ' + config.port + '');

app.listen(config.port);
