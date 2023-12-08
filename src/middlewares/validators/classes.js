const { body } = require("express-validator");
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
    body("name").optional().isLength({ min: 1 }),
    body("part").optional().isLength({ min: 1 }),
    body("topic").optional().isLength({ min: 1 }),
    body("room").optional().isLength({ min: 1 }),
    body("avatar").optional(),
    validateRequest,
  ],
};
