"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateUsername = exports.validateTodo = exports.validatePassword = exports.validateEmail = exports.validateDescription = exports.sanitizeString = exports.createToken = exports.computeHMAC = exports.checkToken = void 0;
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _crypto = require("crypto");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// Generate secure secret key if not provided
const generateSecretKey = () => {
  return (0, _crypto.randomBytes)(32).toString("hex");
};
let secretKey = "default_secret_key";
if (process.env.JWT_SECRET_KEY) {
  secretKey = process.env.JWT_SECRET_KEY;
} else if (process.env.NODE_ENV === "production") {
  console.error("SECURITY WARNING: JWT_SECRET_KEY environment variable is required in production!");
  process.exit(1);
} else {
  console.warn("WARNING: Using generated secret key for development. Set JWT_SECRET_KEY in production!");
  secretKey = generateSecretKey();
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
const checkToken = ({
  token,
  callback
}) => {
  _jsonwebtoken.default.verify(token, secretKey, {
    algorithms: ["HS256"]
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
  // Add salt for better security
  const salt = process.env.PASSWORD_SALT || "default_salt_change_in_production";
  return (0, _crypto.createHash)("sha256").update(id + password + salt).digest("hex");
};

// Input validation utilities
exports.computeHMAC = computeHMAC;
const validateEmail = email => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
exports.validateEmail = validateEmail;
const validatePassword = password => {
  // At least 6 characters
  return typeof password === "string" && password.length >= 6;
};
exports.validatePassword = validatePassword;
const validateUsername = username => {
  // 2-50 characters, no special characters except spaces
  return typeof username === "string" && username.length >= 2 && username.length <= 50 && /^[a-zA-Z0-9\sㄱ-ㅎㅏ-ㅣ가-힣]+$/.test(username);
};
exports.validateUsername = validateUsername;
const validateTodo = todo => {
  return typeof todo === "string" && todo.trim().length >= 1 && todo.length <= 200;
};
exports.validateTodo = validateTodo;
const validateDescription = desc => {
  return typeof desc === "string" && desc.length <= 1000;
};
exports.validateDescription = validateDescription;
const sanitizeString = str => {
  if (typeof str !== "string") return "";
  return str.trim().replace(/[<>]/g, "");
};
exports.sanitizeString = sanitizeString;