"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "mongoose", {
  enumerable: true,
  get: function () {
    return _mongoose.default;
  }
});
exports.TodoList = exports.User = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _mongodb = require("mongodb");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

const User = _mongoose.default.model("users", usersSchema);

exports.User = User;

const TodoList = _mongoose.default.model("todolists", todolistsSchema);

exports.TodoList = TodoList;