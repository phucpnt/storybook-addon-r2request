const { registerExpressAPI } = require("@pollyjs/node-server");

module.exports.register = function (app) {
  registerExpressAPI(app);
}
