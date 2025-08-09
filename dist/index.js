"use strict";

var _express = _interopRequireDefault(require("express"));
var _cors = _interopRequireDefault(require("cors"));
var _morgan = _interopRequireDefault(require("morgan"));
var _path = _interopRequireDefault(require("path"));
var _fs = _interopRequireDefault(require("fs"));
var _url = require("url");
var _rotatingFileStream = require("rotating-file-stream");
var _ejs = _interopRequireDefault(require("ejs"));
var _routes = _interopRequireDefault(require("./routes.js"));
var _authutil = require("./authutil.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// ES module equivalents for __dirname
const _filename = (0, _url.fileURLToPath)(import.meta.url);
const _dirname = _path.default.dirname(_filename);
const app = (0, _express.default)();
app.use((0, _cors.default)());
app.use(function (req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
});

//-- 로깅
const baseDir = _path.default.resolve('.');
const logDirectory = _path.default.join(baseDir, '/log');
_fs.default.existsSync(logDirectory) || _fs.default.mkdirSync(logDirectory);
const accessLogStream = (0, _rotatingFileStream.createStream)("access.log", {
  size: "10M",
  interval: "1d",
  path: logDirectory
});
app.use((0, _morgan.default)('combined', {
  stream: accessLogStream
}));
app.set('port', process.env.PORT || 3000);
app.use(_express.default.static(baseDir + '/public'));
console.log(baseDir + '/views');
app.set('views', baseDir + '/views');
app.set('view engine', 'ejs');
app.engine('html', _ejs.default.renderFile);
app.use(_express.default.json());
app.use(_express.default.urlencoded({
  extended: true
}));
app.use(function (req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
});

//권한 검증용 MW
app.use((req, res, next) => {
  if (!req.path.startsWith('/todolist') && !req.path.startsWith('/todolist_long')) {
    next();
    return;
  }
  //console.log("## JWT Middleware!! : " + req.path)
  let auth_header = req.headers.authorization;
  if (auth_header) {
    let [name, token] = auth_header.split(" ");
    if (typeof name === "string" && name === "Bearer") {
      (0, _authutil.checkToken)({
        token,
        callback: jwtresult => {
          if (jwtresult.status === "success") {
            req.users = jwtresult.users;
            next();
          } else {
            res.json(jwtresult);
          }
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
(0, _routes.default)(app);
const server = app.listen(app.get('port'), function () {
  console.log("할일 목록 서비스가 " + app.get('port') + "번 포트에서 시작되었습니다!");
});