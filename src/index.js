import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
//import fs from "fs";
//import { createStream } from "rotating-file-stream";
import ejs from "ejs";
import routes from "./routes.js";
import { checkToken } from "./authutil.js";

const app = express();

app.use(cors());

app.use(function (req, res, next) {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  next();
});
const baseDir = path.resolve(".");

//-- 로깅

// const logDirectory = path.join(baseDir, "/log");
// fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
// const accessLogStream = createStream("access.log", {
//   size: "10M",
//   interval: "1d",
//   path: logDirectory,
// });

// app.use(morgan("combined", { stream: accessLogStream }));

app.use(
  morgan("combined", {
    stream: {
      write: (message) => {
        console.log(message.trim());
      },
    },
  })
);

app.set("port", process.env.PORT || 3000);

app.use(express.static(baseDir + "/public"));
console.log(baseDir + "/views");
app.set("views", baseDir + "/views");
app.set("view engine", "ejs");
app.engine("html", ejs.renderFile);
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(function (req, res, next) {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  next();
});

//권한 검증용 MW
app.use((req, res, next) => {
  // Skip authentication for main page
  if (req.path === "/") {
    next();
    return;
  }
  
  if (!req.path.startsWith("/todolist") && !req.path.startsWith("/todolist_long")) {
    next();
    return;
  }
  //console.log("## JWT Middleware!! : " + req.path)
  let auth_header = req.headers.authorization;
  if (auth_header) {
    let [name, token] = auth_header.split(" ");
    if (typeof name === "string" && name === "Bearer") {
      checkToken({
        token,
        callback: (jwtresult) => {
          if (jwtresult.status === "success") {
            req.users = jwtresult.users;
            next();
          } else {
            res.json(jwtresult);
          }
        },
      });
    } else {
      res.json({ status: "fail", message: "토큰의 형식이 올바르지 않습니다. Bearer Token 형식을 사용합니다." });
    }
  } else {
    res.json({ status: "fail", message: "authorization 요청 헤더를 통해 토큰이 전달되지 않았습니다." });
  }
});


routes(app);

const server = app.listen(app.get("port"), function () {
  console.log("할일 목록 서비스가 " + app.get("port") + "번 포트에서 시작되었습니다!");
});
