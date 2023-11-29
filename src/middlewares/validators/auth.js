const { body, param } = require("express-validator");
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

  activeAccount: [param("activeCode").isLength({ min: 1 }), validateRequest],

  forgotPassword: [body("email").isEmail(), validateRequest],

  validateResetPasswordCode: [
    body("resetPasswordCode").isLength({ min: 1 }),
    validateRequest,
  ],

  resetPassword: [
    body("resetPasswordCode").isLength({ min: 1 }),
    body("newPassword").isLength({ min: 8 }),
    validateRequest,
  ],
};
