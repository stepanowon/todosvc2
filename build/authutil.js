"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.computeHMAC = exports.checkToken = exports.createToken = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _crypto = require("crypto");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let secretKey = "mysecretkey";

if (process.env.JWT_SECRET_KEY) {
  secretKey = process.env.JWT_SECRET_KEY;
}

const createToken = ({
  users_id,
  role
}) => {
  let token = _jsonwebtoken.default.sign({
    users_id,
    role
  }, secretKey, {
    algorithm: "HS256",
    expiresIn: "7d"
  });

  return token;
};

exports.createToken = createToken;

const checkToken = (token, callback) => {
  _jsonwebtoken.default.verify(token, secretKey, {
    algorithms: ['HS256']
  }, (err, decode) => {
    if (err) {
      callback({
        status: "fail",
        message: err
      });
    } else {
      const exp = new Date(decode.exp * 1000);
      const now = Date.now();

      if (exp < now) {
        callback({
          status: "fail",
          message: "expired token"
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

const computeHMAC = (id, password) => {
  return (0, _crypto.createHash)('sha256').update(id + password).digest('hex');
};

exports.computeHMAC = computeHMAC;