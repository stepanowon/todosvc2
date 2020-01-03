import { ObjectId } from 'mongodb'
import { User, TodoList, mongoose } from './tododb';

export const createUser = async ({ email, username, password, role }) => {
    try {
        if (typeof(email) !== "string" || email === "" || 
            typeof(username) !== "string" || username === "" ||
            typeof(password) !== "string" || password === "" ) {
            throw new Error("Email 주소와 사용자명, 암호를 정확하게 입력하세요");
        }

        //사용자 계정 생성
        let _id = email;
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
            let todo1 = new TodoList({ _id:new ObjectId(), users_id:_id, todo_id:new ObjectId().toHexString(), todo, desc, done })
            todo1.save();
        }

        if (doc)
            return { status: "success", message:"사용자 생성 성공", _id: doc._id };
        else
            return { status: "fail", message:"사용자 생성 실패" };
    } catch(e) {
        return { status: "fail", message:e.message };
    }
}

export const findUser = async ({ email, password }) => {
    try {
        if (typeof(email) !== "string" || email === "" || typeof(password) !== "string" || password === "") {
            throw new Error("Email 주소와 암호를 정확하게 입력하세요");
        }
        let doc = await User.findOne({ _id:email, password });
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
