import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';

let uri;
if (!process.env.MONGODB_URI) {
    uri = "mongodb://localhost:27017/tododb";
} else {
    uri = process.env.MONGODB_URI;
}
mongoose.connect(uri, { useNewUrlParser: true, poolSize:20, useUnifiedTopology:true  })

const usersSchema = new mongoose.Schema({
    _id : String, 
    username: String,
    role : String,
    password: String
})

const todolistsSchema = new mongoose.Schema({
    _id : String,
    users_id : String,
    todo : String,
    desc : String,
    done : Boolean,
    updated: Date,
})

if (!todolistsSchema.options.toObject) {
    todolistsSchema.options.toObject = {};
}

todolistsSchema.set('toObject', {
    transform: (doc, ret) => {
      delete ret._id
      delete ret.__v
      delete ret.updated;
    }
})

todolistsSchema.index({ tokens_id:1, todo_id:1 }, { unique:true })

const User = mongoose.model("users", usersSchema);
const TodoList = mongoose.model("todolists", todolistsSchema);

export { User, TodoList, mongoose };