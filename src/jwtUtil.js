import jwt from 'jsonwebtoken'


let secretKey = "mysecretkey";
if (process.env.JWT_SECRET_KEY) {
    secretKey = process.env.JWT_SECRET_KEY;
}

const createToken = ({ id, role }) => {
    let token = jwt.sign({
        id, role
    }, secretKey, {
        algorithm : "HS256",
        expiresIn:"7d",
    })
    return token;
}

const checkToken = async ({ token }) => {
    try {
        let payload = await jwt.verify(token, secretKey, { algorithms: ['HS256'] })
        payload.status = "success";
        return payload;
    } catch (e) {
        return { status:"fail", message:"유효하지 않거나 파기된 토큰입니다."}
    }

}

export { createToken, checkToken };
