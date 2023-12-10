const { body, param } = require("express-validator");
const validateRequest = require("./validatorRequest.js");

module.exports = {
  create: [
    body("name").isString().isLength({ min: 1 }),
    body("part").optional().isString(),
    body("topic").optional().isString(),
    body("room").optional().isString(),
    validateRequest,
  ],

  update: [
    param("id").isLength({ min: 1 }),
    body("name").optional().isString().isLength({ min: 1 }),
    body("part").optional().isString(),
    body("topic").optional().isString(),
    body("room").optional().isString(),
    body("avatar").optional(),
    validateRequest,
  ],

  pramId: [param("id").isLength({ min: 8 }), validateRequest],

  removeMember: [
    param("id").isLength({ min: 1 }),
    body("userId").isInt(),
    validateRequest,
  ],

  invite: [
    param("id").isLength({ min: 1 }),
    body("email").isEmail(),
    body("role").custom((value) => {
      if (!["teacher", "student"].includes(value)) {
        throw new Error("Role must be either 'teacher' or 'student'");
      }
      return true;
    }),
    validateRequest,
  ],
};
