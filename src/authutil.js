import jwt from "jsonwebtoken";
import { createHash, randomBytes } from "crypto";

// Generate secure secret key if not provided
const generateSecretKey = () => {
  return randomBytes(32).toString("hex");
};

let secretKey = "default_secret_key";
if (process.env.JWT_SECRET_KEY) {
  secretKey = process.env.JWT_SECRET_KEY;
} else if (process.env.NODE_ENV === "production") {
  console.error("SECURITY WARNING: JWT_SECRET_KEY environment variable is required in production!");
  process.exit(1);
} else {
  console.warn("WARNING: Using generated secret key for development. Set JWT_SECRET_KEY in production!");
  secretKey = generateSecretKey();
}

const createToken = ({ users_id, role }) => {
  let token = jwt.sign(
    {
      users_id,
      role,
    },
    secretKey,
    {
      algorithm: "HS256",
      expiresIn: "7d",
    }
  );
  return token;
};

const checkToken = ({ token, callback }) => {
  jwt.verify(token, secretKey, { algorithms: ["HS256"] }, (err, decode) => {
    if (err) {
      callback({ status: "fail", message: err });
    } else {
      const exp = new Date(decode.exp * 1000);
      const now = Date.now();
      if (exp < now) {
        callback({ status: "fail", message: "expired token" });
      } else {
        callback({ status: "success", users: decode });
      }
    }
  });
};

const computeHMAC = (id, password) => {
  // Add salt for better security
  const salt = process.env.PASSWORD_SALT || "default_salt_change_in_production";
  return createHash("sha256")
    .update(id + password + salt)
    .digest("hex");
};

// Input validation utilities
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  // At least 6 characters
  return typeof password === "string" && password.length >= 6;
};

const validateUsername = (username) => {
  // 2-50 characters, no special characters except spaces
  return typeof username === "string" && username.length >= 2 && username.length <= 50 && /^[a-zA-Z0-9\sㄱ-ㅎㅏ-ㅣ가-힣]+$/.test(username);
};

const validateTodo = (todo) => {
  return typeof todo === "string" && todo.trim().length >= 1 && todo.length <= 200;
};

const validateDescription = (desc) => {
  return typeof desc === "string" && desc.length <= 1000;
};

const sanitizeString = (str) => {
  if (typeof str !== "string") return "";
  return str.trim().replace(/[<>]/g, "");
};

export {
  createToken,
  checkToken,
  computeHMAC,
  validateEmail,
  validatePassword,
  validateUsername,
  validateTodo,
  validateDescription,
  sanitizeString,
};
