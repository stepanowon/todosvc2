"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateTodo = exports.toggleDone = exports.getTodoOne = exports.getTodoList = exports.findUser = exports.deleteTodo = exports.createUser = exports.addTodo = void 0;
var _mongodb = require("mongodb");
var _tododb = require("./tododb.js");
var _authutil = require("../authutil.js");
const createUser = async ({
  _id,
  username,
  password,
  role
}) => {
  try {
    // Enhanced validation using imported validators
    if (!_id || !(0, _authutil.validateEmail)(_id)) {
      throw new Error("유효한 이메일 주소를 입력하세요");
    }
    if (!username || !(0, _authutil.validateUsername)(username)) {
      throw new Error("사용자명은 2-50자이며 영문, 숫자, 공백, 한글만 허용됩니다");
    }
    if (!password || typeof password !== "string" || password === "") {
      throw new Error("비밀번호를 입력하세요");
    }

    // Sanitize inputs
    _id = (0, _authutil.sanitizeString)(_id.toLowerCase()); // normalize email
    username = (0, _authutil.sanitizeString)(username);
    role = role || "users"; // default role

    let cnt = await _tododb.User.countDocuments({
      _id
    });
    if (cnt > 0) {
      throw new Error("이미 존재하는 사용자입니다.");
    }

    //사용자 계정 생성
    let userOne = new _tododb.User({
      _id,
      username,
      password,
      role
    });
    let doc = await userOne.save();

    //샘플 todolist 데이터 입력
    let sampledata = [{
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
    for (let i = 0; i < sampledata.length; i++) {
      let {
        todo,
        desc,
        done
      } = sampledata[i];
      let todo1 = new _tododb.TodoList({
        users_id: _id,
        todo,
        desc,
        done
      });
      todo1.save();
    }
    if (doc) return {
      status: "success",
      message: "사용자 생성 성공",
      _id: doc._id
    };else return {
      status: "fail",
      message: "사용자 생성 실패"
    };
  } catch (e) {
    return {
      status: "fail",
      message: e.message
    };
  }
};
exports.createUser = createUser;
const findUser = async ({
  _id,
  password
}) => {
  try {
    if (!_id || !(0, _authutil.validateEmail)(_id)) {
      throw new Error("유효한 이메일 주소를 입력하세요");
    }
    if (!password || typeof password !== "string" || password === "") {
      throw new Error("비밀번호를 입력하세요");
    }

    // Sanitize and normalize email
    _id = (0, _authutil.sanitizeString)(_id.toLowerCase());
    let doc = await _tododb.User.findOne({
      _id,
      password
    });
    if (doc) {
      doc.status = "success";
      return doc;
    } else {
      return {
        status: "fail",
        message: "사용자가 없거나 잘못된 암호"
      };
    }
  } catch (e) {
    return {
      status: "fail",
      message: e.message
    };
  }
};
exports.findUser = findUser;
const getTodoList = async ({
  users_id
}) => {
  try {
    if (typeof users_id !== "string" || users_id === "") {
      throw new Error("users_id 정보가 필요합니다.");
    }
    let todolist = await _tododb.TodoList.find({
      users_id
    }).sort({
      _id: 1
    });
    todolist = todolist.map(t => {
      let {
        _id,
        users_id,
        todo,
        desc,
        done
      } = t;
      return {
        id: _id,
        users_id,
        todo,
        desc,
        done
      };
    });
    return {
      status: "success",
      todolist
    };
  } catch (e) {
    return {
      status: "fail",
      message: "조회 실패 : " + e.message
    };
  }
};
exports.getTodoList = getTodoList;
const getTodoOne = async ({
  users_id,
  _id
}) => {
  try {
    if (typeof users_id !== "string" || users_id === "" || typeof _id !== "string" || _id === "") {
      throw new Error("users_id 정보와 todo의 고유 _id가 필요합니다.");
    }
    let todoOne = await _tododb.TodoList.findOne({
      users_id,
      _id
    });
    if (todoOne) {
      let {
        _id,
        users_id,
        todo,
        desc,
        done
      } = todoOne;
      delete todoOne.updated;
      delete todoOne.__v;
      return {
        status: "success",
        todo: {
          id: _id,
          users_id,
          todo,
          desc,
          done
        }
      };
    } else {
      return {
        status: "fail",
        message: "할일(Todo)이 존재하지 않습니다."
      };
    }
  } catch (e) {
    return {
      status: "fail",
      message: "조회 실패 : " + e.message
    };
  }
};
exports.getTodoOne = getTodoOne;
const addTodo = async ({
  users_id,
  todo,
  desc
}) => {
  try {
    if (!users_id || !(0, _authutil.validateEmail)(users_id)) {
      throw new Error("유효한 사용자 ID가 필요합니다.");
    }
    if (!todo || !(0, _authutil.validateTodo)(todo)) {
      throw new Error("할일은 1-200자 사이여야 합니다.");
    }

    // Sanitize inputs
    users_id = (0, _authutil.sanitizeString)(users_id.toLowerCase());
    todo = (0, _authutil.sanitizeString)(todo);
    if (desc) {
      if (!(0, _authutil.validateDescription)(desc)) {
        throw new Error("설명은 1000자 이하여야 합니다.");
      }
      desc = (0, _authutil.sanitizeString)(desc);
    } else {
      desc = "설명 없음";
    }
    let todoOne = new _tododb.TodoList({
      users_id,
      todo,
      desc,
      done: false
    });
    await todoOne.save();
    let {
      _id,
      done
    } = todoOne;
    return {
      status: "success",
      message: "할일 추가 성공",
      todo: {
        id: _id,
        users_id,
        todo,
        desc,
        done
      }
    };
  } catch (e) {
    return {
      status: "fail",
      message: "추가 실패 : " + e.message
    };
  }
};
exports.addTodo = addTodo;
const updateTodo = async ({
  users_id,
  _id,
  todo,
  desc,
  done
}) => {
  try {
    if (!users_id || !(0, _authutil.validateEmail)(users_id)) {
      throw new Error("유효한 사용자 ID가 필요합니다.");
    }
    if (!_id || typeof _id !== "string" || _id.trim() === "") {
      throw new Error("유효한 할일 ID가 필요합니다.");
    }
    if (!todo || !(0, _authutil.validateTodo)(todo)) {
      throw new Error("할일은 1-200자 사이여야 합니다.");
    }
    if (typeof done !== "boolean") {
      throw new Error("완료 상태는 true 또는 false여야 합니다.");
    }

    // Sanitize inputs
    users_id = (0, _authutil.sanitizeString)(users_id.toLowerCase());
    _id = (0, _authutil.sanitizeString)(_id);
    todo = (0, _authutil.sanitizeString)(todo);
    if (desc) {
      if (!(0, _authutil.validateDescription)(desc)) {
        throw new Error("설명은 1000자 이하여야 합니다.");
      }
      desc = (0, _authutil.sanitizeString)(desc);
    } else {
      desc = "설명 없음";
    }
    let result = await _tododb.TodoList.updateOne({
      _id,
      users_id
    }, {
      todo,
      desc,
      done
    });
    if (result.matchedCount === 1) {
      return {
        status: "success",
        message: "할일 업데이트 성공",
        _id: _id
      };
    } else {
      return {
        status: "fail",
        message: "할일을 찾을 수 없거나 권한이 없습니다."
      };
    }
  } catch (e) {
    return {
      status: "fail",
      message: "할일 업데이트 실패 : " + e.message
    };
  }
};
exports.updateTodo = updateTodo;
const deleteTodo = async ({
  users_id,
  _id
}) => {
  try {
    if (!users_id || !(0, _authutil.validateEmail)(users_id)) {
      throw new Error("유효한 사용자 ID가 필요합니다.");
    }
    if (!_id || typeof _id !== "string" || _id.trim() === "") {
      throw new Error("유효한 할일 ID가 필요합니다.");
    }

    // Sanitize inputs
    users_id = (0, _authutil.sanitizeString)(users_id.toLowerCase());
    _id = (0, _authutil.sanitizeString)(_id);
    let result = await _tododb.TodoList.deleteOne({
      _id,
      users_id
    });
    if (result.deletedCount === 1) {
      return {
        status: "success",
        message: "할일 삭제 성공",
        _id: _id
      };
    } else {
      return {
        status: "fail",
        message: "할일을 찾을 수 없거나 권한이 없습니다."
      };
    }
  } catch (e) {
    return {
      status: "fail",
      message: "할일 삭제 실패 : " + e.message
    };
  }
};
exports.deleteTodo = deleteTodo;
const toggleDone = async ({
  users_id,
  _id
}) => {
  try {
    if (!users_id || !(0, _authutil.validateEmail)(users_id)) {
      throw new Error("유효한 사용자 ID가 필요합니다.");
    }
    if (!_id || typeof _id !== "string" || _id.trim() === "") {
      throw new Error("유효한 할일 ID가 필요합니다.");
    }

    // Sanitize inputs
    users_id = (0, _authutil.sanitizeString)(users_id.toLowerCase());
    _id = (0, _authutil.sanitizeString)(_id);
    let doc = await _tododb.TodoList.findOne({
      _id,
      users_id
    });
    if (!doc) {
      return {
        status: "fail",
        message: "할일을 찾을 수 없거나 권한이 없습니다."
      };
    }
    let done = !doc.done;
    let result = await _tododb.TodoList.updateOne({
      _id,
      users_id
    }, {
      done
    });
    if (result.matchedCount === 1) {
      return {
        status: "success",
        message: "할일 완료 처리 성공",
        _id
      };
    } else {
      return {
        status: "fail",
        message: "할일 완료 처리 실패"
      };
    }
  } catch (e) {
    return {
      status: "fail",
      message: "할일 완료 처리 실패 : " + e.message
    };
  }
};
exports.toggleDone = toggleDone;