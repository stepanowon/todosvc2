"use strict";

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _cors = _interopRequireDefault(require("cors"));

var _morgan = _interopRequireDefault(require("morgan"));

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _routes = _interopRequireDefault(require("./routes"));

var _authutil = require("./authutil");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var app = (0, _express["default"])();
app.use((0, _cors["default"])());
app.use(function (req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
}); //-- 로깅

var baseDir = _path["default"].resolve('.');

var rfs = require("rotating-file-stream");

var logDirectory = _path["default"].join(baseDir, '/log');

_fs["default"].existsSync(logDirectory) || _fs["default"].mkdirSync(logDirectory);
var accessLogStream = rfs.createStream("access.log", {
  size: "10M",
  interval: "1d",
  path: logDirectory
});
app.use((0, _morgan["default"])('combined', {
  stream: accessLogStream
}));
app.set('port', process.env.PORT || 8082);
app.use(_express["default"]["static"](baseDir + '/public'));
console.log(baseDir + '/views');
app.set('views', baseDir + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(_bodyParser["default"].json());
app.use(_bodyParser["default"].urlencoded({
  extended: true
}));
app.use(function (req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
});
app.use(function (req, res, next) {
  if (!req.path.startsWith('/todolist') && !req.path.startsWith('/todolist_long')) {
    next();
    return;
  } //console.log("## JWT Middleware!! : " + req.path)


  var auth_header = req.headers.authorization;

  if (auth_header) {
    var _auth_header$split = auth_header.split(" "),
        _auth_header$split2 = _slicedToArray(_auth_header$split, 2),
        name = _auth_header$split2[0],
        token = _auth_header$split2[1];

    if (typeof name === "string" && name === "Bearer") {
      (0, _authutil.checkToken)(token, function (jwtresult) {
        if (jwtresult.status === "success") {
          req.users = jwtresult.users;
          next();
        } else {
          res.json(jwtresult);
        }
      });
    } else {
      res.json({
        status: "fail",
        message: "토큰의 형식이 올바르지 않습니다. Bearer Token 형식을 사용합니다."
      });
    }
  } else {
    res.json({
      status: "fail",
      message: "authorization 요청 헤더를 통해 토큰이 전달되지 않았습니다."
    });
  }
});
(0, _routes["default"])(app);
var server = app.listen(app.get('port'), function () {
  console.log("할일 목록 서비스가 " + app.get('port') + "번 포트에서 시작되었습니다!");
});