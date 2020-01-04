"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _dao = require("./dao");

var _systemSleep = _interopRequireDefault(require("system-sleep"));

var _authutil = require("./authutil");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _default = function _default(app) {
  app.get('/', function (req, res) {
    console.log("### GET /");
    res.render('index', {
      title: 'todolist 서비스 v2.0',
      subtitle: '(node.js + express + lokijs)'
    });
  });
  app.post('/users/create',
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(req, res) {
      var _req$body, id, password, username, result;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              console.log("### POST /users/create");
              _req$body = req.body, id = _req$body.id, password = _req$body.password, username = _req$body.username;
              password = (0, _authutil.computeHMAC)(id, password);
              _context.next = 5;
              return (0, _dao.createUser)({
                _id: id,
                username: username,
                password: password,
                role: "users"
              });

            case 5:
              result = _context.sent;
              res.json(result);

            case 7:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
  app.post('/login',
  /*#__PURE__*/
  function () {
    var _ref2 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2(req, res) {
      var _req$body2, id, password, doc, token;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              console.log("### POST /login");
              _req$body2 = req.body, id = _req$body2.id, password = _req$body2.password;
              password = (0, _authutil.computeHMAC)(id, password);
              _context2.next = 5;
              return (0, _dao.findUser)({
                _id: id,
                password: password
              });

            case 5:
              doc = _context2.sent;

              if (doc && doc.status === "success") {
                token = (0, _authutil.createToken)({
                  users_id: doc._id,
                  role: doc.role
                });
                res.json({
                  status: "success",
                  message: "로그인 성공",
                  token: token
                });
              } else {
                res.json(doc);
              }

            case 7:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function (_x3, _x4) {
      return _ref2.apply(this, arguments);
    };
  }());
  app.get('/todolist',
  /*#__PURE__*/
  function () {
    var _ref3 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3(req, res) {
      var users_id, response;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              console.log("### GET /todolist : " + req.users.users_id);
              users_id = req.users.users_id;
              _context3.next = 4;
              return (0, _dao.getTodoList)({
                users_id: users_id
              });

            case 4:
              response = _context3.sent;
              res.json(response);

            case 6:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function (_x5, _x6) {
      return _ref3.apply(this, arguments);
    };
  }());
  app.get('/todolist_long',
  /*#__PURE__*/
  function () {
    var _ref4 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee4(req, res) {
      var users_id, response;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              (0, _systemSleep["default"])(1000);
              console.log("### GET /todolist : " + req.users.users_id);
              users_id = req.users.users_id;
              _context4.next = 5;
              return (0, _dao.getTodoList)({
                users_id: users_id
              });

            case 5:
              response = _context4.sent;
              res.json(response);

            case 7:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));

    return function (_x7, _x8) {
      return _ref4.apply(this, arguments);
    };
  }());
  app.get('/todolist/:id',
  /*#__PURE__*/
  function () {
    var _ref5 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee5(req, res) {
      var users_id, _id, response;

      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              console.log("### GET /todolist/:id : " + req.users.users_id);
              users_id = req.users.users_id;
              _id = req.params.id;
              _context5.next = 5;
              return (0, _dao.getTodoOne)({
                users_id: users_id,
                _id: _id
              });

            case 5:
              response = _context5.sent;
              res.json(response);

            case 7:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));

    return function (_x9, _x10) {
      return _ref5.apply(this, arguments);
    };
  }());
  app.get('/todolist_long/:id',
  /*#__PURE__*/
  function () {
    var _ref6 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee6(req, res) {
      var users_id, _id, response;

      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              console.log("### GET /todolist_long/:id : " + req.users.users_id);
              users_id = req.users.users_id;
              _id = req.params.id;
              _context6.next = 5;
              return (0, _dao.getTodoOne)({
                users_id: users_id,
                _id: _id
              });

            case 5:
              response = _context6.sent;
              res.json(response);

            case 7:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    }));

    return function (_x11, _x12) {
      return _ref6.apply(this, arguments);
    };
  }());
  app.post('/todolist',
  /*#__PURE__*/
  function () {
    var _ref7 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee7(req, res) {
      var users_id, _req$body3, todo, desc, response;

      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              console.log("### POST /todolist : " + req.users.users_id);
              users_id = req.users.users_id;
              _req$body3 = req.body, todo = _req$body3.todo, desc = _req$body3.desc;
              _context7.next = 5;
              return (0, _dao.addTodo)({
                users_id: users_id,
                todo: todo,
                desc: desc
              });

            case 5:
              response = _context7.sent;
              res.json(response);

            case 7:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7);
    }));

    return function (_x13, _x14) {
      return _ref7.apply(this, arguments);
    };
  }());
  app.post('/todolist_long',
  /*#__PURE__*/
  function () {
    var _ref8 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee8(req, res) {
      var users_id, _req$body4, todo, desc, response;

      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              console.log("### POST /todolist : " + req.users.users_id);
              users_id = req.users.users_id;
              _req$body4 = req.body, todo = _req$body4.todo, desc = _req$body4.desc;
              _context8.next = 5;
              return (0, _dao.addTodo)({
                users_id: users_id,
                todo: todo,
                desc: desc
              });

            case 5:
              response = _context8.sent;
              res.json(response);

            case 7:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8);
    }));

    return function (_x15, _x16) {
      return _ref8.apply(this, arguments);
    };
  }());
  app.put('/todolist/:id',
  /*#__PURE__*/
  function () {
    var _ref9 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee9(req, res) {
      var users_id, _id, _req$body5, todo, desc, done, response;

      return regeneratorRuntime.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              console.log("### PUT /todolist/:id : " + req.users.users_id);
              users_id = req.users.users_id;
              _id = req.params.id;
              _req$body5 = req.body, todo = _req$body5.todo, desc = _req$body5.desc, done = _req$body5.done;
              _context9.next = 6;
              return (0, _dao.updateTodo)({
                users_id: users_id,
                _id: _id,
                todo: todo,
                desc: desc,
                done: done
              });

            case 6:
              response = _context9.sent;
              res.json(response);

            case 8:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9);
    }));

    return function (_x17, _x18) {
      return _ref9.apply(this, arguments);
    };
  }());
  app.put('/todolist_long/:id',
  /*#__PURE__*/
  function () {
    var _ref10 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee10(req, res) {
      var users_id, _id, _req$body6, todo, desc, done, response;

      return regeneratorRuntime.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              console.log("### PUT /todolist_long/:id : " + req.users.users_id);
              (0, _systemSleep["default"])(1000);
              users_id = req.users.users_id;
              _id = req.params.id;
              _req$body6 = req.body, todo = _req$body6.todo, desc = _req$body6.desc, done = _req$body6.done;
              _context10.next = 7;
              return (0, _dao.updateTodo)({
                users_id: users_id,
                _id: _id,
                todo: todo,
                desc: desc,
                done: done
              });

            case 7:
              response = _context10.sent;
              res.json(response);

            case 9:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10);
    }));

    return function (_x19, _x20) {
      return _ref10.apply(this, arguments);
    };
  }());
  app["delete"]('/todolist/:id',
  /*#__PURE__*/
  function () {
    var _ref11 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee11(req, res) {
      var users_id, _id, response;

      return regeneratorRuntime.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              console.log("### PUT /todolist/:id : " + req.users.users_id);
              users_id = req.users.users_id;
              _id = req.params.id;
              _context11.next = 5;
              return (0, _dao.deleteTodo)({
                users_id: users_id,
                _id: _id
              });

            case 5:
              response = _context11.sent;
              res.json(response);

            case 7:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11);
    }));

    return function (_x21, _x22) {
      return _ref11.apply(this, arguments);
    };
  }());
  app.put('/todolist/:id/done',
  /*#__PURE__*/
  function () {
    var _ref12 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee12(req, res) {
      var users_id, _id, response;

      return regeneratorRuntime.wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              console.log("### PUT /todolist/:id/done : " + req.users.users_id);
              users_id = req.users.users_id;
              _id = req.params.id;
              _context12.next = 5;
              return (0, _dao.toggleDone)({
                users_id: users_id,
                _id: _id
              });

            case 5:
              response = _context12.sent;
              res.json(response);

            case 7:
            case "end":
              return _context12.stop();
          }
        }
      }, _callee12);
    }));

    return function (_x23, _x24) {
      return _ref12.apply(this, arguments);
    };
  }()); //----에러 처리 시작

  app.get('*', function (req, res, next) {
    var err = new Error();
    err.status = 404;
    next(err);
  });
  app.use(function (err, req, res, next) {
    console.log("### ERROR!!");

    if (err.status === 404) {
      res.status(404).json({
        status: 404,
        message: "잘못된 URI 요청"
      });
    } else if (err.status === 500) {
      res.status(500).json({
        status: 500,
        message: "내부 서버 오류"
      });
    } else {
      res.status(err.status).jsonp({
        status: "fail",
        message: err.message
      });
    }
  });
};

exports["default"] = _default;