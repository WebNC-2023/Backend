const { body } = require("express-validator");
const validateRequest = require("./validatorRequest.js");

module.exports = {
  updateProfile: [
    body("firstName").optional().isLength({ min: 1 }),
    body("lastName").optional().isLength({ min: 1 }),
    body("avatar").optional(),
    validateRequest,
  ],

  changePassword: [
    body("currentPassword").isLength({ min: 8 }),
    body("newPassword").isLength({ min: 8 }),
    validateRequest,
  ],
};
