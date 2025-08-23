import { createUser, findUser , getTodoList, getTodoOne, addTodo, updateTodo, deleteTodo, toggleDone } from './dao/index.js';
import sleep from 'sleep-promise';
import { createToken, checkToken, computeHMAC } from './authutil.js';
import { 
    validateUserCreation, 
    validateLogin, 
    validateTodoCreation, 
    validateTodoUpdate, 
    validateMongoId,
    createRateLimiter 
} from './validation.js';


export default (app) => { 

    // Apply rate limiting to authentication endpoints
    const authRateLimiter = createRateLimiter(10, 15 * 60 * 1000); // 10 requests per 15 minutes
    const apiRateLimiter = createRateLimiter(100, 15 * 60 * 1000); // 100 requests per 15 minutes

    app.get('/', (req, res) => {
        console.log("### GET /");
        res.render('index', {
             title: 'todolist 서비스 v2.0',
             subtitle : '(node.js + express + mongodb + mongoose + jwt)'
        })
    });

    app.post('/users/create', authRateLimiter, validateUserCreation, async (req, res)=> {
        console.log("### POST /users/create");
        try {
            let { id, password, username } = req.body;
            password = computeHMAC(id, password);
            const result = await createUser({ _id:id, username, password, role:"users" });
            res.json(result);
        } catch (error) {
            console.error('User creation error:', error);
            res.status(500).json({ 
                status: "fail", 
                message: "Internal server error during user creation" 
            });
        }
    })

    app.post('/login', authRateLimiter, validateLogin, async (req,res)=> {
        console.log("### POST /login")
        try {
            let { id, password } = req.body;
            password = computeHMAC(id, password);
            const doc = await findUser({ _id:id, password });
            if (doc && doc.status === "success") {
                let token = createToken({ users_id:doc._id, role:doc.role })
                res.json({ status:"success", message:"로그인 성공", token:token })
            } else {
                res.status(401).json(doc)
            }
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ 
                status: "fail", 
                message: "Internal server error during login" 
            });
        }
    })

    app.get('/todolist', apiRateLimiter, async (req,res)=> {
        console.log("### GET /todolist : " + req.users.users_id);
        try {
            let users_id = req.users.users_id;
            let response = await getTodoList({ users_id });
            res.json(response);
        } catch (error) {
            console.error('Get todolist error:', error);
            res.status(500).json({ 
                status: "fail", 
                message: "Internal server error while fetching todolist" 
            });
        }
     })

    app.get('/todolist_long', async (req,res)=> {
        await sleep(1000);
        console.log("### GET /todolist : " + req.users.users_id);
        let users_id = req.users.users_id;
        let response = await getTodoList({ users_id });
        res.json(response);
    })

    app.get('/todolist/:id', apiRateLimiter, validateMongoId, async(req, res) => {
        console.log("### GET /todolist/:id : " + req.users.users_id);
        try {
            let users_id = req.users.users_id;
            let _id = req.params.id;

            let response = await getTodoOne({ users_id, _id });
            res.json(response);
        } catch (error) {
            console.error('Get todo error:', error);
            res.status(500).json({ 
                status: "fail", 
                message: "Internal server error while fetching todo" 
            });
        }
    })

    app.get('/todolist_long/:id', async(req, res) => {
        console.log("### GET /todolist_long/:id : " + req.users.users_id);
        await sleep(1000);
        let users_id = req.users.users_id;
        let _id = req.params.id;

        let response = await getTodoOne({ users_id, _id });
        res.json(response);
    })

    app.post('/todolist', apiRateLimiter, validateTodoCreation, async(req,res) => {
        console.log("### POST /todolist : " + req.users.users_id);
        try {
            let users_id = req.users.users_id;
            let { todo, desc } = req.body;
            let response = await addTodo({ users_id, todo, desc })
            res.json(response);
        } catch (error) {
            console.error('Add todo error:', error);
            res.status(500).json({ 
                status: "fail", 
                message: "Internal server error while adding todo" 
            });
        }
    })

    app.post('/todolist_long', async(req,res) => {
        console.log("### POST /todolist : " + req.users.users_id);
        await sleep(1000);
        let users_id = req.users.users_id;
        let { todo, desc } = req.body;
        let response = await addTodo({ users_id, todo, desc })
        res.json(response);
    })

    app.put('/todolist/:id', apiRateLimiter, validateMongoId, validateTodoUpdate, async(req,res)=> {
        console.log("### PUT /todolist/:id : " + req.users.users_id);
        try {
            let users_id = req.users.users_id;
            let _id = req.params.id;
            let { todo, desc, done } = req.body;
            let response = await updateTodo({ users_id, _id, todo, desc, done });
            res.json(response);
        } catch (error) {
            console.error('Update todo error:', error);
            res.status(500).json({ 
                status: "fail", 
                message: "Internal server error while updating todo" 
            });
        }
    })

    app.put('/todolist_long/:id', async(req,res)=> {
        console.log("### PUT /todolist_long/:id : " + req.users.users_id);
        await sleep(1000);
        let users_id = req.users.users_id;
        let _id = req.params.id;
        let { todo, desc, done } = req.body;
        let response = await updateTodo({ users_id, _id, todo, desc, done });
        res.json(response);
    })

    app.delete('/todolist/:id', apiRateLimiter, validateMongoId, async(req, res)=> {
        console.log("### DELETE /todolist/:id : " + req.users.users_id);
        try {
            let users_id = req.users.users_id;
            let _id = req.params.id;
            let response = await deleteTodo({ users_id, _id });
            res.json(response);
        } catch (error) {
            console.error('Delete todo error:', error);
            res.status(500).json({ 
                status: "fail", 
                message: "Internal server error while deleting todo" 
            });
        }
    })
    
    app.delete('/todolist_long/:id', async(req, res)=> {
        console.log("### PUT /todolist_long/:id : " + req.users.users_id);
        await sleep(1000);
        let users_id = req.users.users_id;
        let _id = req.params.id;
        let response = await deleteTodo({ users_id, _id });
        res.json(response);
    })

    app.put('/todolist/:id/done', apiRateLimiter, validateMongoId, async(req, res)=> {
        console.log("### PUT /todolist/:id/done : " + req.users.users_id);
        try {
            let users_id = req.users.users_id;
            let _id = req.params.id;
            let response = await toggleDone({ users_id, _id });
            res.json(response);
        } catch (error) {
            console.error('Toggle done error:', error);
            res.status(500).json({ 
                status: "fail", 
                message: "Internal server error while toggling todo status" 
            });
        }
    })

    app.put('/todolist_long/:id/done', async(req, res)=> {
        console.log("### PUT /todolist/:id/done : " + req.users.users_id);
        await sleep(1000);
        let users_id = req.users.users_id;
        let _id = req.params.id;
        let response = await toggleDone({ users_id, _id });
        res.json(response);
    })

    //----에러 처리 시작
    app.get('*', (req, res, next) => {
        var err = new Error();
        err.status = 404;
        next(err);
    });

    app.use((err, req, res, next) => {
        console.log("### ERROR!!")
        if(err.status === 404) {
            res.status(404).json({ status:404, message:"잘못된 URI 요청"});
        } else if (err.status === 500) {
            res.status(500).json({ status:500, message:"내부 서버 오류"});
        } else {
            res.status(err.status).jsonp({ status:"fail", message:err.message });
        }
    });


}
