import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import dotenv from "dotenv";
dotenv.config();

let uri;
if (!process.env.MONGODB_URI) {
    uri = "mongodb://localhost:27017/tododb";
} else {
    uri = process.env.MONGODB_URI;
}
console.log(uri)
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology:true  })

const usersSchema = new mongoose.Schema({
    _id : String, 
    username: String,
    role : String,
    password: String,
    created: { type:Date, default: ()=> Date.now() } 
})

const todolistsSchema = new mongoose.Schema({
    _id : { type:String, default: ()=> new ObjectId().toHexString() },
    users_id : String,
    todo : String,
    desc : String,
    done : Boolean,
    created: { type:Date, default: ()=> Date.now() }
})

const User = mongoose.model("users", usersSchema);
const TodoList = mongoose.model("todolists", todolistsSchema);

export { User, TodoList, mongoose };