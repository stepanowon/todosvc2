"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.computeHMAC = exports.checkToken = exports.createToken = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _crypto = require("crypto");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var secretKey = "mysecretkey";

if (process.env.JWT_SECRET_KEY) {
  secretKey = process.env.JWT_SECRET_KEY;
}

var createToken = function createToken(_ref) {
  var users_id = _ref.users_id,
      role = _ref.role;

  var token = _jsonwebtoken["default"].sign({
    users_id: users_id,
    role: role
  }, secretKey, {
    algorithm: "HS256",
    expiresIn: "7d"
  });

  return token;
};

exports.createToken = createToken;

var checkToken = function checkToken(token, callback) {
  _jsonwebtoken["default"].verify(token, secretKey, {
    algorithms: ['HS256']
  }, function (err, decode) {
    if (err) {
      callback({
        status: "fail",
        message: err
      });
    } else {
      var exp = new Date(decode.exp * 1000);
      var now = Date.now();

      if (exp < now) {
        callback({
          status: "fail",
          message: "유효기간이 지나 파기된 토큰입니다"
        });
      } else {
        callback({
          status: "success",
          users: decode
        });
      }
    }
  });
};

exports.checkToken = checkToken;

var computeHMAC = function computeHMAC(id, password) {
  return (0, _crypto.createHash)('sha256').update(id + password).digest('hex');
};

exports.computeHMAC = computeHMAC;