"use strict";

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.join");

require("core-js/modules/es.function.name");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.get-own-property-descriptor");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.promise");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPolly = getPolly;
exports.withR2Request = void 0;

require("regenerator-runtime/runtime");

var _adapterFetch = _interopRequireDefault(require("@pollyjs/adapter-fetch"));

var _core = require("@pollyjs/core");

var _persisterRest = _interopRequireDefault(require("@pollyjs/persister-rest"));

var _addons = _interopRequireWildcard(require("@storybook/addons"));

var _coreEvents = require("@storybook/core-events");

var _react = _interopRequireDefault(require("react"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var polly = null;

function getPollyInstance(recordName, recordingMode) {
  return new _core.Polly(recordName, {
    adapters: ["fetch"],
    // Hook into `fetch`
    persister: "rest",
    // Read/write to/from local-storage
    logging: false,
    // Log requests to console,
    recordFailedRequests: true,
    persisterOptions: {
      rest: {
        host: [window.location.protocol, "//", window.location.host].join("")
      }
    },
    mode: recordingMode
  });
}

var store = {
  polly: polly,
  config: null
};

function setupPolly(_ref) {
  var recordName = _ref.recordName,
      recordingMode = _ref.recordingMode,
      matchRequestsBy = _ref.matchRequestsBy;
  var polly = store.polly;

  if (!polly) {
    _core.Polly.register(_adapterFetch["default"]);

    _core.Polly.register(_persisterRest["default"]);

    polly = getPollyInstance(recordName, recordingMode);
  } else {
    polly.disconnect(_adapterFetch["default"]);
    polly = getPollyInstance(recordName, recordingMode);
  }

  polly.configure({
    matchRequestsBy: matchRequestsBy
  });
  store.polly = polly;
  return polly;
}

var defaultConfig = {
  recordingMode: "replay"
};
var withR2Request = (0, _addons.makeDecorator)({
  name: "withR2Request",
  parameterName: "r2Request",
  wrapper: function wrapper(getStory, context, _ref2) {
    var _ref2$parameters = _ref2.parameters,
        parameters = _ref2$parameters === void 0 ? {} : _ref2$parameters;

    var channel = _addons["default"].getChannel();

    var r2Request = store.config || parameters || defaultConfig;
    var matchRequestsBy = (parameters || {}).matchRequestsBy;
    console.info(parameters);
    console.info("matchRequestsBy", matchRequestsBy);
    var polly = setupPolly({
      recordName: "".concat(context.kind, "/").concat(context.name),
      recordingMode: r2Request.recordingMode,
      matchRequestsBy: matchRequestsBy
    });
    polly.server.any().on("response", function (req) {
      channel.emit("r2Request/new-request", {
        url: req.url,
        pathname: req.pathname,
        query: req.query,
        action: req.action
      });
    });
    channel.emit(_coreEvents.REGISTER_SUBSCRIPTION, registerR2Request);
    channel.emit("r2Request/config-change", r2Request);
    return _react["default"].cloneElement(getStory(context), {
      key: "r2Request-".concat(r2Request.recordingMode)
    });
  }
});
exports.withR2Request = withR2Request;

function registerR2Request() {
  var channel = _addons["default"].getChannel();

  channel.on("r2Request/persist-records", onSaveRecord);
  channel.on(_coreEvents.STORY_CHANGED, resetStore);
  channel.on("r2Request/refresh", refresh);
  return disconnectR2Request;
}

function disconnectR2Request() {
  var channel = _addons["default"].getChannel();

  store.config = null;
  channel.removeListener("r2Request/persist-records", onSaveRecord);
  channel.removeListener(_coreEvents.STORY_CHANGED, resetStore);
  channel.removeListener("r2Request/refresh", refresh);
}

function resetStore() {
  store.config = null;
}

function onSaveRecord() {
  return _onSaveRecord.apply(this, arguments);
}

function _onSaveRecord() {
  _onSaveRecord = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return store.polly.stop();

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _onSaveRecord.apply(this, arguments);
}

function refresh(_x) {
  return _refresh.apply(this, arguments);
}
/**
 * @returns {Polly}
 */


function _refresh() {
  _refresh = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(r2Request) {
    var channel;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            channel = _addons["default"].getChannel();
            console.info("forceRequest");
            store.config = r2Request;
            channel.emit(_coreEvents.FORCE_RE_RENDER);

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _refresh.apply(this, arguments);
}

function getPolly() {
  return store.polly;
}