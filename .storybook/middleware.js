const {register} = require('../src/middleware');

module.exports = function expressMiddleware(app) {
  register(app);
}
