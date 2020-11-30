const path = require('path');
const bodyParser = require('body-parser');

const PUBLIC_PATH = path.join(__dirname, 'public');

module.exports = (app, express) => {
  app.use(bodyParser.json());
  app.use('/', express.static(PUBLIC_PATH, { extensions: ['html'] }));
  return app;
};
