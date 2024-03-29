"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _dao = require("./dao");
var _sleepPromise = _interopRequireDefault(require("sleep-promise"));
var _authutil = require("./authutil");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _default = app => {
  app.get('/', (req, res) => {
    console.log("### GET /");
    res.render('index', {
      title: 'todolist 서비스 v2.0',
      subtitle: '(node.js + express + mongodb + mongoose + jwt)'
    });
  });
  app.post('/users/create', async (req, res) => {
    console.log("### POST /users/create");
    let {
      id,
      password,
      username
    } = req.body;
    password = (0, _authutil.computeHMAC)(id, password);
    const result = await (0, _dao.createUser)({
      _id: id,
      username,
      password,
      role: "users"
    });
    res.json(result);
  });
  app.post('/login', async (req, res) => {
    console.log("### POST /login");
    let {
      id,
      password
    } = req.body;
    password = (0, _authutil.computeHMAC)(id, password);
    const doc = await (0, _dao.findUser)({
      _id: id,
      password
    });
    if (doc && doc.status === "success") {
      let token = (0, _authutil.createToken)({
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
  });
  app.get('/todolist', async (req, res) => {
    console.log("### GET /todolist : " + req.users.users_id);
    let users_id = req.users.users_id;
    let response = await (0, _dao.getTodoList)({
      users_id
    });
    res.json(response);
  });
  app.get('/todolist_long', async (req, res) => {
    await (0, _sleepPromise.default)(1000);
    console.log("### GET /todolist : " + req.users.users_id);
    let users_id = req.users.users_id;
    let response = await (0, _dao.getTodoList)({
      users_id
    });
    res.json(response);
  });
  app.get('/todolist/:id', async (req, res) => {
    console.log("### GET /todolist/:id : " + req.users.users_id);
    let users_id = req.users.users_id;
    let _id = req.params.id;
    let response = await (0, _dao.getTodoOne)({
      users_id,
      _id
    });
    res.json(response);
  });
  app.get('/todolist_long/:id', async (req, res) => {
    console.log("### GET /todolist_long/:id : " + req.users.users_id);
    await (0, _sleepPromise.default)(1000);
    let users_id = req.users.users_id;
    let _id = req.params.id;
    let response = await (0, _dao.getTodoOne)({
      users_id,
      _id
    });
    res.json(response);
  });
  app.post('/todolist', async (req, res) => {
    console.log("### POST /todolist : " + req.users.users_id);
    let users_id = req.users.users_id;
    let {
      todo,
      desc
    } = req.body;
    let response = await (0, _dao.addTodo)({
      users_id,
      todo,
      desc
    });
    res.json(response);
  });
  app.post('/todolist_long', async (req, res) => {
    console.log("### POST /todolist : " + req.users.users_id);
    await (0, _sleepPromise.default)(1000);
    let users_id = req.users.users_id;
    let {
      todo,
      desc
    } = req.body;
    let response = await (0, _dao.addTodo)({
      users_id,
      todo,
      desc
    });
    res.json(response);
  });
  app.put('/todolist/:id', async (req, res) => {
    console.log("### PUT /todolist/:id : " + req.users.users_id);
    let users_id = req.users.users_id;
    let _id = req.params.id;
    let {
      todo,
      desc,
      done
    } = req.body;
    let response = await (0, _dao.updateTodo)({
      users_id,
      _id,
      todo,
      desc,
      done
    });
    res.json(response);
  });
  app.put('/todolist_long/:id', async (req, res) => {
    console.log("### PUT /todolist_long/:id : " + req.users.users_id);
    await (0, _sleepPromise.default)(1000);
    let users_id = req.users.users_id;
    let _id = req.params.id;
    let {
      todo,
      desc,
      done
    } = req.body;
    let response = await (0, _dao.updateTodo)({
      users_id,
      _id,
      todo,
      desc,
      done
    });
    res.json(response);
  });
  app.delete('/todolist/:id', async (req, res) => {
    console.log("### PUT /todolist/:id : " + req.users.users_id);
    let users_id = req.users.users_id;
    let _id = req.params.id;
    let response = await (0, _dao.deleteTodo)({
      users_id,
      _id
    });
    res.json(response);
  });
  app.delete('/todolist_long/:id', async (req, res) => {
    console.log("### PUT /todolist_long/:id : " + req.users.users_id);
    await (0, _sleepPromise.default)(1000);
    let users_id = req.users.users_id;
    let _id = req.params.id;
    let response = await (0, _dao.deleteTodo)({
      users_id,
      _id
    });
    res.json(response);
  });
  app.put('/todolist/:id/done', async (req, res) => {
    console.log("### PUT /todolist/:id/done : " + req.users.users_id);
    let users_id = req.users.users_id;
    let _id = req.params.id;
    let response = await (0, _dao.toggleDone)({
      users_id,
      _id
    });
    res.json(response);
  });
  app.put('/todolist_long/:id/done', async (req, res) => {
    console.log("### PUT /todolist/:id/done : " + req.users.users_id);
    await (0, _sleepPromise.default)(1000);
    let users_id = req.users.users_id;
    let _id = req.params.id;
    let response = await (0, _dao.toggleDone)({
      users_id,
      _id
    });
    res.json(response);
  });

  //----에러 처리 시작
  app.get('*', (req, res, next) => {
    var err = new Error();
    err.status = 404;
    next(err);
  });
  app.use((err, req, res, next) => {
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
exports.default = _default;