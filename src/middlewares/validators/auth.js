const { body } = require("express-validator");
const validateRequest = require("./validatorRequest.js");

module.exports = {
  signUp: [
    body("firstName").isLength({ min: 1 }),
    body("lastName").isLength({ min: 1 }),
    body("email").isEmail(),
    body("password").isLength({ min: 8 }),
    validateRequest,
  ],

  signIn: [
    body("email").isEmail(),
    body("password").isLength({ min: 8 }),
    validateRequest,
  ],
};
