"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toggleDone = exports.deleteTodo = exports.updateTodo = exports.addTodo = exports.getTodoOne = exports.getTodoList = exports.findUser = exports.createUser = void 0;

var _mongodb = require("mongodb");

var _tododb = require("./tododb");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var createUser =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(_ref) {
    var _id, username, password, role, userOne, doc, sampledata, i, _sampledata$i, todo, desc, done, todo1;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _id = _ref._id, username = _ref.username, password = _ref.password, role = _ref.role;
            _context.prev = 1;

            if (!(typeof _id !== "string" || _id === "" || typeof username !== "string" || username === "" || typeof password !== "string" || password === "")) {
              _context.next = 4;
              break;
            }

            throw new Error("Email 주소와 사용자명, 암호를 정확하게 입력하세요");

          case 4:
            //사용자 계정 생성
            userOne = new _tododb.User({
              _id: _id,
              username: username,
              password: password,
              role: role
            });
            _context.next = 7;
            return userOne.save();

          case 7:
            doc = _context.sent;
            //샘플 todolist 데이터 입력
            sampledata = [{
              todo: "ES6 공부",
              desc: "ES6공부를 해야 합니다",
              done: true
            }, {
              todo: "Vue 학습",
              desc: "Vue 학습을 해야 합니다",
              done: false
            }, {
              todo: "야구장",
              desc: "프로야구 경기도 봐야합니다.",
              done: false
            }];

            for (i = 0; i < sampledata.length; i++) {
              _sampledata$i = sampledata[i], todo = _sampledata$i.todo, desc = _sampledata$i.desc, done = _sampledata$i.done;
              todo1 = new _tododb.TodoList({
                _id: new _mongodb.ObjectId().toHexString(),
                users_id: _id,
                todo: todo,
                desc: desc,
                done: done
              });
              todo1.save();
            }

            if (!doc) {
              _context.next = 14;
              break;
            }

            return _context.abrupt("return", {
              status: "success",
              message: "사용자 생성 성공",
              _id: doc._id
            });

          case 14:
            return _context.abrupt("return", {
              status: "fail",
              message: "사용자 생성 실패"
            });

          case 15:
            _context.next = 20;
            break;

          case 17:
            _context.prev = 17;
            _context.t0 = _context["catch"](1);
            return _context.abrupt("return", {
              status: "fail",
              message: _context.t0.message
            });

          case 20:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 17]]);
  }));

  return function createUser(_x) {
    return _ref2.apply(this, arguments);
  };
}();

exports.createUser = createUser;

var findUser =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(_ref3) {
    var _id, password, doc;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _id = _ref3._id, password = _ref3.password;
            _context2.prev = 1;

            if (!(typeof _id !== "string" || _id === "" || typeof password !== "string" || password === "")) {
              _context2.next = 4;
              break;
            }

            throw new Error("_id와 암호를 정확하게 입력하세요");

          case 4:
            _context2.next = 6;
            return _tododb.User.findOne({
              _id: _id,
              password: password
            });

          case 6:
            doc = _context2.sent;

            if (!doc) {
              _context2.next = 12;
              break;
            }

            doc.status = "success";
            return _context2.abrupt("return", doc);

          case 12:
            return _context2.abrupt("return", {
              status: "fail",
              message: "사용자가 없거나 잘못된 암호"
            });

          case 13:
            _context2.next = 18;
            break;

          case 15:
            _context2.prev = 15;
            _context2.t0 = _context2["catch"](1);
            return _context2.abrupt("return", {
              status: "fail",
              message: _context2.t0.message
            });

          case 18:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[1, 15]]);
  }));

  return function findUser(_x2) {
    return _ref4.apply(this, arguments);
  };
}();

exports.findUser = findUser;

var getTodoList =
/*#__PURE__*/
function () {
  var _ref6 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(_ref5) {
    var users_id, todolist;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            users_id = _ref5.users_id;
            _context3.prev = 1;

            if (!(typeof users_id !== "string" || users_id === "")) {
              _context3.next = 4;
              break;
            }

            throw new Error("users_id 정보가 필요합니다.");

          case 4:
            _context3.next = 6;
            return _tododb.TodoList.find({
              users_id: users_id
            }).sort({
              _id: 1
            });

          case 6:
            todolist = _context3.sent;
            todolist = todolist.map(function (t) {
              var _id = t._id,
                  users_id = t.users_id,
                  todo = t.todo,
                  desc = t.desc,
                  done = t.done;
              return {
                _id: _id,
                users_id: users_id,
                todo: todo,
                desc: desc,
                done: done
              };
            });
            return _context3.abrupt("return", {
              status: "success",
              todolist: todolist
            });

          case 11:
            _context3.prev = 11;
            _context3.t0 = _context3["catch"](1);
            return _context3.abrupt("return", {
              status: "fail",
              message: "조회 실패 : " + _context3.t0.message
            });

          case 14:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[1, 11]]);
  }));

  return function getTodoList(_x3) {
    return _ref6.apply(this, arguments);
  };
}();

exports.getTodoList = getTodoList;

var getTodoOne =
/*#__PURE__*/
function () {
  var _ref8 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(_ref7) {
    var users_id, _id, todoOne, _id2, _users_id, todo, desc, done;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            users_id = _ref7.users_id, _id = _ref7._id;
            _context4.prev = 1;

            if (!(typeof users_id !== "string" || users_id === "" || typeof _id !== "string" || _id === "")) {
              _context4.next = 4;
              break;
            }

            throw new Error("users_id 정보와 todo의 고유 _id가 필요합니다.");

          case 4:
            _context4.next = 6;
            return _tododb.TodoList.findOne({
              users_id: users_id,
              _id: _id
            });

          case 6:
            todoOne = _context4.sent;

            if (!todoOne) {
              _context4.next = 14;
              break;
            }

            _id2 = todoOne._id, _users_id = todoOne.users_id, todo = todoOne.todo, desc = todoOne.desc, done = todoOne.done;
            delete todoOne.updated;
            delete todoOne.__v;
            return _context4.abrupt("return", {
              status: "success",
              todo: {
                _id: _id2,
                users_id: _users_id,
                todo: todo,
                desc: desc,
                done: done
              }
            });

          case 14:
            return _context4.abrupt("return", {
              status: "fail",
              message: "할일(Todo)이 존재하지 않습니다."
            });

          case 15:
            _context4.next = 20;
            break;

          case 17:
            _context4.prev = 17;
            _context4.t0 = _context4["catch"](1);
            return _context4.abrupt("return", {
              status: "fail",
              message: "조회 실패 : " + _context4.t0.message
            });

          case 20:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[1, 17]]);
  }));

  return function getTodoOne(_x4) {
    return _ref8.apply(this, arguments);
  };
}();

exports.getTodoOne = getTodoOne;

var addTodo =
/*#__PURE__*/
function () {
  var _ref10 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(_ref9) {
    var users_id, todo, desc, todoOne, _id, done;

    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            users_id = _ref9.users_id, todo = _ref9.todo, desc = _ref9.desc;
            _context5.prev = 1;

            if (!(typeof users_id !== "string" || users_id === "" || typeof todo !== "string" || todo === "")) {
              _context5.next = 4;
              break;
            }

            throw new Error("users_id와 todo는 반드시 필요합니다.");

          case 4:
            if (!desc || desc === "") desc = "설명 없음";
            todoOne = new _tododb.TodoList({
              users_id: users_id,
              todo: todo,
              desc: desc,
              done: false
            });
            todoOne.save();
            _id = todoOne._id, done = todoOne.done;
            return _context5.abrupt("return", {
              status: "success",
              message: "연락처 추가 성공",
              todo: {
                _id: _id,
                users_id: users_id,
                todo: todo,
                desc: desc,
                done: done
              }
            });

          case 11:
            _context5.prev = 11;
            _context5.t0 = _context5["catch"](1);
            return _context5.abrupt("return", {
              status: "fail",
              message: "추가 실패 : " + _context5.t0.message
            });

          case 14:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[1, 11]]);
  }));

  return function addTodo(_x5) {
    return _ref10.apply(this, arguments);
  };
}();

exports.addTodo = addTodo;

var updateTodo =
/*#__PURE__*/
function () {
  var _ref12 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6(_ref11) {
    var users_id, _id, todo, desc, done, result;

    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            users_id = _ref11.users_id, _id = _ref11._id, todo = _ref11.todo, desc = _ref11.desc, done = _ref11.done;
            _context6.prev = 1;

            if (!(typeof users_id !== "string" || users_id === "" || typeof _id !== "string" || _id === "" || typeof todo !== "string" || todo === "" || typeof done !== "boolean")) {
              _context6.next = 4;
              break;
            }

            throw new Error("users_id, _id, todo, done은 반드시 필요합니다.");

          case 4:
            if (!desc || desc === "") desc = "설명 없음";
            _context6.next = 7;
            return _tododb.TodoList.updateOne({
              _id: _id,
              users_id: users_id
            }, {
              todo: todo,
              desc: desc,
              done: done
            });

          case 7:
            result = _context6.sent;

            if (!(result.ok === 1 && result.nModified === 1)) {
              _context6.next = 12;
              break;
            }

            return _context6.abrupt("return", {
              status: "success",
              message: "할일 업데이트 성공",
              _id: _id
            });

          case 12:
            return _context6.abrupt("return", {
              status: "fail",
              message: "할일 업데이트 실패",
              result: result
            });

          case 13:
            _context6.next = 18;
            break;

          case 15:
            _context6.prev = 15;
            _context6.t0 = _context6["catch"](1);
            return _context6.abrupt("return", {
              status: "fail",
              message: "할일 업데이트 실패 : " + _context6.t0.message
            });

          case 18:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[1, 15]]);
  }));

  return function updateTodo(_x6) {
    return _ref12.apply(this, arguments);
  };
}();

exports.updateTodo = updateTodo;

var deleteTodo =
/*#__PURE__*/
function () {
  var _ref14 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee7(_ref13) {
    var users_id, _id;

    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            users_id = _ref13.users_id, _id = _ref13._id;
            _context7.prev = 1;

            if (!(typeof users_id !== "string" || users_id === "" || typeof _id !== "string" || _id === "")) {
              _context7.next = 4;
              break;
            }

            throw new Error("users_id와 _id는 반드시 필요합니다.");

          case 4:
            _context7.next = 6;
            return _tododb.TodoList.deleteOne({
              _id: _id,
              users_id: users_id
            });

          case 6:
            return _context7.abrupt("return", {
              status: "success",
              message: "할일 삭제 성공",
              _id: _id
            });

          case 9:
            _context7.prev = 9;
            _context7.t0 = _context7["catch"](1);
            return _context7.abrupt("return", {
              status: "fail",
              message: "할일 삭제 실패 : " + _context7.t0.message
            });

          case 12:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[1, 9]]);
  }));

  return function deleteTodo(_x7) {
    return _ref14.apply(this, arguments);
  };
}();

exports.deleteTodo = deleteTodo;

var toggleDone =
/*#__PURE__*/
function () {
  var _ref16 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee8(_ref15) {
    var users_id, _id, doc, done, result;

    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            users_id = _ref15.users_id, _id = _ref15._id;
            _context8.prev = 1;

            if (!(typeof users_id !== "string" || users_id === "" || typeof _id !== "string" || _id === "")) {
              _context8.next = 4;
              break;
            }

            throw new Error("users_id와 _id는 반드시 필요합니다.");

          case 4:
            _context8.next = 6;
            return _tododb.TodoList.findOne({
              _id: _id,
              users_id: users_id
            });

          case 6:
            doc = _context8.sent;
            done = !doc.done;
            _context8.next = 10;
            return _tododb.TodoList.updateOne({
              _id: _id,
              users_id: users_id
            }, {
              done: done
            });

          case 10:
            result = _context8.sent;

            if (!(result.ok === 1 && result.nModified === 1)) {
              _context8.next = 15;
              break;
            }

            return _context8.abrupt("return", {
              status: "success",
              message: "할일 완료 처리 성공",
              _id: _id
            });

          case 15:
            return _context8.abrupt("return", {
              status: "fail",
              message: "할일 완료 처리 실패",
              result: result
            });

          case 16:
            _context8.next = 21;
            break;

          case 18:
            _context8.prev = 18;
            _context8.t0 = _context8["catch"](1);
            return _context8.abrupt("return", {
              status: "fail",
              message: "할일 완료 처리 실패 : " + _context8.t0.message
            });

          case 21:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[1, 18]]);
  }));

  return function toggleDone(_x8) {
    return _ref16.apply(this, arguments);
  };
}();

exports.toggleDone = toggleDone;