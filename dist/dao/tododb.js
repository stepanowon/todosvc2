"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.User = exports.TodoList = void 0;
Object.defineProperty(exports, "mongoose", {
  enumerable: true,
  get: function () {
    return _mongoose.default;
  }
});
var _mongoose = _interopRequireDefault(require("mongoose"));
var _mongodb = require("mongodb");
var _dotenv = _interopRequireDefault(require("dotenv"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
_dotenv.default.config();
let uri;
if (!process.env.MONGODB_URI) {
  uri = "mongodb://localhost:27017/tododb";
} else {
  uri = process.env.MONGODB_URI;
}
console.log(uri);
_mongoose.default.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const usersSchema = new _mongoose.default.Schema({
  _id: String,
  username: String,
  role: String,
  password: String,
  created: {
    type: Date,
    default: () => Date.now()
  }
});
const todolistsSchema = new _mongoose.default.Schema({
  _id: {
    type: String,
    default: () => new _mongodb.ObjectId().toHexString()
  },
  users_id: String,
  todo: String,
  desc: String,
  done: Boolean,
  created: {
    type: Date,
    default: () => Date.now()
  }
});
const User = exports.User = _mongoose.default.model("users", usersSchema);
const TodoList = exports.TodoList = _mongoose.default.model("todolists", todolistsSchema);