"use strict";

var _require = require("@pollyjs/node-server"),
    registerExpressAPI = _require.registerExpressAPI;

module.exports.register = function (app) {
  registerExpressAPI(app);
};