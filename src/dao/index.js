import { ObjectId } from 'mongodb'
import { User, TodoList } from './tododb';

export const createUser = async ({ _id, username, password, role }) => {
    try {
        if (typeof(_id) !== "string" || _id === "" || 
            typeof(username) !== "string" || username === "" ||
            typeof(password) !== "string" || password === "" ) {
            throw new Error("Email 주소와 사용자명, 암호를 정확하게 입력하세요");
        }
        let cnt = await User.countDocuments({ _id })
        if (cnt > 0) {
            throw new Error("이미 존재하는 사용자입니다.")
        }

        //사용자 계정 생성
        let userOne = new User({ _id, username, password, role })
        let doc = await userOne.save()
        
        //샘플 todolist 데이터 입력
        let sampledata = [
            { todo:"ES6 공부", desc:"ES6공부를 해야 합니다", done:true }, 
            { todo:"Vue 학습", desc:"Vue 학습을 해야 합니다", done:false },
            { todo:"야구장", desc:"프로야구 경기도 봐야합니다.", done:false },
        ];

        for (let i=0; i < sampledata.length; i++) {
            let { todo, desc, done} = sampledata[i];
            let todo1 = new TodoList({ users_id:_id, todo, desc, done })
            todo1.save();
        }

        if (doc)
            return { status: "success", message:"사용자 생성 성공", _id: doc._id };
        else
            return { status: "fail", message:"사용자 생성 실패" };
    } catch(e) {
        return { status: "fail", message: e.message };
    }
}

export const findUser = async ({ _id, password }) => {
    try {
        if (typeof(_id) !== "string" || _id === "" || typeof(password) !== "string" || password === "") {
            throw new Error("_id와 암호를 정확하게 입력하세요");
        }
        let doc = await User.findOne({ _id, password });
        if (doc) { 
            doc.status = "success";
            return doc;
        } else {
            return { status:"fail", message:"사용자가 없거나 잘못된 암호"  };
        }
    } catch(e) {
        return { status:"fail", message:e.message  };
    }
}

export const getTodoList = async({ users_id }) => {
    try {
        if (typeof(users_id) !== "string" || users_id === "") {
            throw new Error("users_id 정보가 필요합니다.");
        }
        let todolist = await TodoList.find({ users_id }).sort({ _id: 1 });
        todolist = todolist.map((t)=> {
            let { _id, users_id, todo, desc, done} = t;
            return { id:_id, users_id, todo, desc, done };
        })
        return { status:"success", todolist };
    } catch(e) {
        return { status:"fail", message:"조회 실패 : " + e.message }
    }
}

export const getTodoOne = async({ users_id, _id }) => {
    try {
        if (typeof(users_id) !== "string" || users_id === "" || 
            typeof(_id) !== "string" || _id === "") {
            throw new Error("users_id 정보와 todo의 고유 _id가 필요합니다.");
        }
        let todoOne = await TodoList.findOne({ users_id, _id });
        if (todoOne) {
            let { _id, users_id, todo, desc, done } = todoOne;
            delete todoOne.updated;
            delete todoOne.__v;
            return { status : "success", todo: { id:_id, users_id, todo, desc, done } };
        } else {
            return { status : "fail", message: "할일(Todo)이 존재하지 않습니다." };
        }
    } catch(e) {
        return { status:"fail", message:"조회 실패 : " + e.message }
    }
}

export const addTodo = async({ users_id, todo, desc }) => {
    try {
        if (typeof(users_id) !== "string" || users_id === "" || 
            typeof(todo) !== "string" || todo === "") {
            throw new Error("users_id와 todo는 반드시 필요합니다.");
        }
        if (!desc || desc === "") desc = "설명 없음";
        let todoOne = new TodoList({ users_id, todo, desc, done:false });
        todoOne.save()
        let { _id, done } = todoOne;
        return { status:"success", message:"연락처 추가 성공", todo: { id:_id, users_id, todo, desc, done } };
    } catch(e) {
        return { status:"fail", message:"추가 실패 : " + e.message }
    }
}

export const updateTodo = async({ users_id, _id, todo, desc, done })=> {
    try {
        if (typeof(users_id) !== "string" || users_id === "" || 
            typeof(_id) !== "string" || _id === "" || typeof(todo) !== "string" || todo === "" ||
            typeof(done) !== "boolean") {
            throw new Error("users_id, _id, todo, done은 반드시 필요합니다.");
        }

        if (!desc || desc === "") desc="설명 없음";
        let result = await TodoList.updateOne({ _id, users_id }, { todo, desc, done })
        if (result.ok === 1 && result.nModified === 1) {
            return { status:"success", message:"할일 업데이트 성공", _id:_id };
        } else {
            return { status:"fail", message:"할일 업데이트 실패", result };
        }
    } catch(e) {
        return { status:"fail", message:"할일 업데이트 실패 : " + e.message };
    }
}

export const deleteTodo = async({ users_id, _id }) => {
    try {
        if (typeof(users_id) !== "string" || users_id === "" || 
            typeof(_id) !== "string" || _id === "") {
            throw new Error("users_id와 _id는 반드시 필요합니다.");
        }
        await TodoList.deleteOne({ _id, users_id });
        return { status:"success", message : "할일 삭제 성공", _id:_id };
    } catch(e) {
        return { status:"fail", message:"할일 삭제 실패 : "+e.message };
    }
}

export const toggleDone = async({ users_id, _id }) => {
    try {
        if (typeof(users_id) !== "string" || users_id === "" || 
            typeof(_id) !== "string" || _id === "") {
            throw new Error("users_id와 _id는 반드시 필요합니다.");
        }
        let doc = await TodoList.findOne({ _id, users_id })
        let done = !doc.done;
        let result = await TodoList.updateOne({ _id, users_id }, { done })
        if (result.ok === 1 && result.nModified === 1) {
            return { status:"success", message:"할일 완료 처리 성공", _id };
        } else {
            return { status:"fail", message:"할일 완료 처리 실패", result };
        }
    } catch(e) {
        return { status:"fail", message:"할일 완료 처리 실패 : " + e.message };
    }
}