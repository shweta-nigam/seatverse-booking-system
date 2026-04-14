import ApiError from "../../common/utils/api-error.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../common/utils/jwt.utils.js";
import { pool } from "../../../index.js"
import bcrypt from "bcryptjs"


export const register =  async ({name, email, password, role}) =>{

  const existing = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  )

  if(existing.rows.length > 0){
    throw ApiError.conflict("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10)

const result = await pool.query(
  `INSERT INTO users (name, email, password, role)
  VALUES ($1, $2, $3, $4)
  RETURNING id, name, email, role`,

  [name,email, hashedPassword, role]

);

const user = result.rows[0]
return user;
}

export const login = async({ email, password}) => {
  console.log("BODY:", email, password);

if (!email || !password) {
  throw ApiError.badRequest("Email and password required");
}

  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  )

  if (result.rows.length === 0){
    throw ApiError.unauthorized("Invalid email or password");
  }

  const user = result.rows[0];

  const isMatch = await bcrypt.compare(password, user.password);

  if(!isMatch){
 throw ApiError.unauthorized("Invalid credentials")
  }

  const accessToken = generateAccessToken({
    id: user.id,
    role: user.role
  })

  const refreshToken = generateRefreshToken({id: user.id})

  await pool.query(
    "UPDATE users SET refresh_token = $1 WHERE id = $2",
    [refreshToken, user.id]
  );

  delete user.password;
  delete user.refresh_token

  return { user , accessToken, refreshToken}
}


export const refresh = async (token) => {
  if (!token) throw ApiError.unauthorized("Refresh token missing");

  const decoded = verifyRefreshToken(token);

  const result = await pool.query(
    "SELECT * FROM users WHERE id = $1",
    [decoded.id]
  );

  if (result.rows.length === 0) {
    throw ApiError.unauthorized("User not found");
  }

  const user = result.rows[0];

  if (user.refresh_token !== token) {
    throw ApiError.unauthorized("Invalid refresh token");
  }

  const accessToken = generateAccessToken({
    id: user.id,
    role: user.role,
  });

  return { accessToken };
};





