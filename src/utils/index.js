const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const checkToken = (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    return false;
  }
};

const randomString = (length = 16) => {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);
};

module.exports = { checkToken, randomString };
