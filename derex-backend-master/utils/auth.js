const jwt = require("jsonwebtoken");
const { encryptSymmetric, decryptSymmetric } = require("./encryption");

const masterKey = process.env.TOKEN_SECRET;
const jwtKey = process.env.TOKEN_SECRET_2;

const signJwt = (userData) => {
  const encryptedData = encryptSymmetric(JSON.stringify(userData), masterKey);
  return jwt.sign({ data: encryptedData }, jwtKey, { expiresIn: "2d" });
};

const verifyJwt = (token) => {
  const { data } = jwt.verify(token, jwtKey);
  const decryptedData = decryptSymmetric(data, masterKey);
  return JSON.parse(decryptedData);
};

module.exports = {
  signJwt,
  verifyJwt,
};
