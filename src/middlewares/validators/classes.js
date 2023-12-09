const { body, param } = require("express-validator");
const validateRequest = require("./validatorRequest.js");

module.exports = {
  create: [
    body("name").isLength({ min: 1 }),
    body("part").optional().isLength({ min: 1 }),
    body("topic").optional().isLength({ min: 1 }),
    body("room").optional().isLength({ min: 1 }),
    validateRequest,
  ],

  update: [
    param("id").isLength({ min: 1 }),
    body("name").optional().isLength({ min: 1 }),
    body("part").optional().isLength({ min: 1 }),
    body("topic").optional().isLength({ min: 1 }),
    body("room").optional().isLength({ min: 1 }),
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
