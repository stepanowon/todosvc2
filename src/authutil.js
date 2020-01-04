import jwt from 'jsonwebtoken'
import { createHash } from 'crypto'

let secretKey = "mysecretkey";
if (process.env.JWT_SECRET_KEY) {
    secretKey = process.env.JWT_SECRET_KEY;
}

const createToken = ({ users_id, role }) => {
    let token = jwt.sign({
        users_id, role
    }, secretKey, {
        algorithm : "HS256",
        expiresIn:"7d",
    })
    return token;
}

const checkToken = (token, callback) => {
    jwt.verify(token, secretKey, { algorithms: ['HS256'] }, (err, decode) => { 
        if (err) {
            callback({status: "fail", message:err })
        } else {
            const exp = new Date(decode.exp * 1000)
            const now = Date.now()
            if (exp < now) {
              callback({ status:"fail", message: "유효기간이 지나 파기된 토큰입니다" })
            } else {
              callback({ status:"success", users: decode})
            }
        }
    })
}

const computeHMAC = (id, password) => {
    return createHash('sha256').update(id + password).digest('hex');
} 

export { createToken, checkToken, computeHMAC };
