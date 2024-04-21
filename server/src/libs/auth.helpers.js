
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

//generate hashed password
const GenerateHashedPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

//compare hashed password
const CompareHashedPassword = async (password, oldPassword) => {
  return await bcrypt.compare(password, oldPassword);
};

//encode jwt token
const encodeAuthToken = (data) => {
  return jwt.sign(data, process.env.JWT_SECRET);
};

//decode jwt token
const decodeAuthToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export {
  GenerateHashedPassword,
  CompareHashedPassword,
  encodeAuthToken,
  decodeAuthToken,
};
