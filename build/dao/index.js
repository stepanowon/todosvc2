"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toggleDone = exports.deleteTodo = exports.updateTodo = exports.addTodo = exports.getTodoOne = exports.getTodoList = exports.findUser = exports.createUser = void 0;

var _mongodb = require("mongodb");

var _tododb = require("./tododb");

const createUser = async ({
  _id,
  username,
  password,
  role
}) => {
  try {
    if (typeof _id !== "string" || _id === "" || typeof username !== "string" || username === "" || typeof password !== "string" || password === "") {
      throw new Error("Email 주소와 사용자명, 암호를 정확하게 입력하세요");
    } //사용자 계정 생성


    let userOne = new _tododb.User({
      _id,
      username,
      password,
      role
    });
    let doc = await userOne.save(); //샘플 todolist 데이터 입력

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
        _id: new _mongodb.ObjectId().toHexString(),
        users_id: _id,
        todo,
        desc,
        done,
        updated: Date.now()
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
    if (typeof _id !== "string" || _id === "" || typeof password !== "string" || password === "") {
      throw new Error("_id와 암호를 정확하게 입력하세요");
    }

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
        _id,
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
          _id,
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
    if (typeof users_id !== "string" || users_id === "" || typeof todo !== "string" || todo === "") {
      throw new Error("users_id와 todo는 반드시 필요합니다.");
    }

    if (!desc || desc === "") desc = "설명 없음";
    let todoOne = new _tododb.TodoList({
      _id: new _mongodb.ObjectId().toHexString(),
      users_id,
      todo,
      desc,
      done: false,
      updated: Date.now()
    });
    todoOne.save();
    let {
      _id,
      done
    } = todoOne;
    return {
      status: "success",
      message: "연락처 추가 성공",
      todo: {
        _id,
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
    if (typeof users_id !== "string" || users_id === "" || typeof _id !== "string" || _id === "" || typeof todo !== "string" || todo === "" || typeof done !== "boolean") {
      throw new Error("users_id, _id, todo, done은 반드시 필요합니다.");
    }

    if (!desc || desc === "") desc = "설명 없음";
    let result = await _tododb.TodoList.updateOne({
      _id,
      users_id
    }, {
      todo,
      desc,
      done
    });

    if (result.ok === 1 && result.nModified === 1) {
      return {
        status: "success",
        message: "할일 업데이트 성공",
        _id: _id
      };
    } else {
      return {
        status: "fail",
        message: "할일 업데이트 실패",
        result
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
    if (typeof users_id !== "string" || users_id === "" || typeof _id !== "string" || _id === "") {
      throw new Error("users_id와 _id는 반드시 필요합니다.");
    }

    await _tododb.TodoList.deleteOne({
      _id,
      users_id
    });
    return {
      status: "success",
      message: "할일 삭제 성공",
      _id: _id
    };
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
    if (typeof users_id !== "string" || users_id === "" || typeof _id !== "string" || _id === "") {
      throw new Error("users_id와 _id는 반드시 필요합니다.");
    }

    let doc = await _tododb.TodoList.findOne({
      _id,
      users_id
    });
    let done = !doc.done;
    let result = await _tododb.TodoList.updateOne({
      _id,
      users_id
    }, {
      done
    });

    if (result.ok === 1 && result.nModified === 1) {
      return {
        status: "success",
        message: "할일 완료 처리 성공",
        _id
      };
    } else {
      return {
        status: "fail",
        message: "할일 완료 처리 실패",
        result
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