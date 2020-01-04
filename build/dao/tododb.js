"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "mongoose", {
  enumerable: true,
  get: function get() {
    return _mongoose["default"];
  }
});
exports.TodoList = exports.User = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _mongodb = require("mongodb");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var uri;

if (!process.env.MONGODB_URI) {
  uri = "mongodb://localhost:27017/tododb";
} else {
  uri = process.env.MONGODB_URI;
}

_mongoose["default"].connect(uri, {
  useNewUrlParser: true,
  poolSize: 20,
  useUnifiedTopology: true
});

var usersSchema = new _mongoose["default"].Schema({
  _id: String,
  username: String,
  role: String,
  password: String
});
var todolistsSchema = new _mongoose["default"].Schema({
  _id: {
    type: String,
    "default": new _mongodb.ObjectId().toHexString()
  },
  users_id: String,
  todo: String,
  desc: String,
  done: Boolean,
  updated: {
    type: Date,
    "default": Date.now
  }
});

if (!todolistsSchema.options.toObject) {
  todolistsSchema.options.toObject = {};
}

todolistsSchema.set('toObject', {
  transform: function transform(doc, ret) {
    delete ret._id;
    delete ret.__v;
    delete ret.updated;
  }
});
todolistsSchema.index({
  tokens_id: 1,
  todo_id: 1
}, {
  unique: true
});

var User = _mongoose["default"].model("users", usersSchema);

exports.User = User;

var TodoList = _mongoose["default"].model("todolists", todolistsSchema);

exports.TodoList = TodoList;