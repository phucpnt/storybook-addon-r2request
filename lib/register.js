"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.array.slice");

require("core-js/modules/es.object.create");

require("core-js/modules/es.object.define-properties");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.freeze");

require("core-js/modules/es.object.get-own-property-descriptor");

require("core-js/modules/es.object.get-prototype-of");

require("core-js/modules/es.object.set-prototype-of");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.string.iterator");

require("core-js/modules/web.dom-collections.iterator");

var _react = _interopRequireDefault(require("react"));

var _theming = require("@storybook/theming");

var _addons = _interopRequireWildcard(require("@storybook/addons"));

var _coreEvents = require("@storybook/core-events");

var _components = require("@storybook/components");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  padding: 1em;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Field = _components.Form.Field,
    Select = _components.Form.Select; // Register the addon with a unique name.

_addons["default"].register("r2Request", function (api) {
  // Also need to set a unique name to the panel.
  var channel = _addons["default"].getChannel();

  _addons["default"].addPanel("r2Request/panel", {
    type: _addons.types.PANEL,
    title: function title() {
      return _react["default"].createElement(R2RequestTitlePanel, {
        channel: channel
      });
    },
    render: function render(_ref) {
      var active = _ref.active,
          key = _ref.key;
      return _react["default"].createElement(R2RequestPanel, {
        active: active,
        key: key,
        channel: channel,
        api: api
      });
    }
  });
});

var Page = _theming.styled.div(_templateObject());

var R2RequestTitlePanel =
/*#__PURE__*/
function (_React$Component) {
  _inherits(R2RequestTitlePanel, _React$Component);

  function R2RequestTitlePanel() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, R2RequestTitlePanel);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(R2RequestTitlePanel)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.state = {
      requestList: [],
      isHavingNewRecord: false,
      isHavingReplayRecord: false
    };

    _this.onNewRequest = function (req) {
      _this.setState({
        requestList: _this.state.requestList.concat(req),
        isHavingNewRecord: _this.state.isHavingNewRecord || req.action === "record",
        isHavingReplayRecord: _this.state.isHavingReplayRecord || req.action === "replay"
      });
    };

    _this.onStoryChange = function (story) {
      _this.setState({
        requestList: [],
        isHavingNewRecord: false,
        isHavingReplayRecord: false
      });
    };

    return _this;
  }

  _createClass(R2RequestTitlePanel, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var channel = this.props.channel;
      channel.on("r2Request/new-request", this.onNewRequest);
      channel.on(_coreEvents.STORY_RENDERED, this.onStoryChange);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$state = this.state,
          isHavingNewRecord = _this$state.isHavingNewRecord,
          isHavingReplayRecord = _this$state.isHavingReplayRecord;
      return _react["default"].createElement("div", null, isHavingNewRecord && _react["default"].createElement("span", {
        title: "have requests without recorded"
      }, "\uD83D\uDD34 "), isHavingReplayRecord && _react["default"].createElement("span", {
        title: "have requests replayed"
      }, "\uD83C\uDFA5 "), " ", "R2Request");
    }
  }]);

  return R2RequestTitlePanel;
}(_react["default"].Component);

var R2RequestPanel =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(R2RequestPanel, _React$Component2);

  function R2RequestPanel() {
    var _getPrototypeOf3;

    var _this2;

    _classCallCheck(this, R2RequestPanel);

    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    _this2 = _possibleConstructorReturn(this, (_getPrototypeOf3 = _getPrototypeOf(R2RequestPanel)).call.apply(_getPrototypeOf3, [this].concat(args)));
    _this2.state = {
      requestList: [],
      newRequestList: [],
      recordingMode: 'replay'
    };

    _this2.onStoryChange = function (story) {
      _this2.setState({
        requestList: [],
        newRequestList: []
      });
    };

    _this2.onNewRequest = function (req) {
      _this2.setState({
        requestList: _this2.state.requestList.concat(req),
        newRequestList: req.action === 'record' ? _this2.state.newRequestList.concat(req) : _this2.state.newRequestList
      });
    };

    _this2.recordRequest = function () {
      _this2.props.channel.emit("r2Request/persist-records");
    };

    _this2.onChangeRecordingMode = function (mode) {
      _this2.setState({
        recordingMode: mode
      });
    };

    _this2.refreshPage = function () {
      var channel = _this2.props.channel;
      channel.emit('r2Request/refresh', {
        recordingMode: _this2.state.recordingMode
      });
    };

    return _this2;
  }

  _createClass(R2RequestPanel, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var channel = this.props.channel;
      channel.on("r2Request/new-request", this.onNewRequest);
      channel.on(_coreEvents.STORY_RENDERED, this.onStoryChange);
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var active = this.props.active;
      var _this$state2 = this.state,
          newRequestList = _this$state2.newRequestList,
          requestList = _this$state2.requestList;

      if (!active) {
        return null;
      }

      return _react["default"].createElement(Page, null, _react["default"].createElement(Field, {
        key: "recordMode",
        label: "Recording mode"
      }, _react["default"].createElement(Select, {
        value: this.state.recordingMode,
        onChange: function onChange(evt) {
          return _this3.onChangeRecordingMode(evt.target.value);
        },
        size: 1
      }, _react["default"].createElement("option", {
        value: "replay"
      }, "Replay"), _react["default"].createElement("option", {
        value: "record"
      }, "Record"))), _react["default"].createElement("br", null), _react["default"].createElement(_components.Button, {
        primary: newRequestList.length > 0,
        outline: true,
        onClick: this.recordRequest
      }, "Save requests (", requestList.length, ") (", newRequestList.length, " new)"), _react["default"].createElement(_components.Button, {
        secondary: true,
        onClick: this.refreshPage
      }, "Refresh page"));
    }
  }]);

  return R2RequestPanel;
}(_react["default"].Component);