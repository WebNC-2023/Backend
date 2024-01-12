const { body, param } = require("express-validator");
const validateRequest = require("./validatorRequest.js");

module.exports = {
  updateBulk: [
    body("classId").isLength({ min: 1 }),
    body("assignments").isArray(),
    body("assignments.*.title").isString().notEmpty(),
    body("assignments.*.type").isString().notEmpty(),
    body("assignments.*.deadline")
      .optional({ nullable: true })
      .isISO8601()
      .toDate(),
    body("assignments.*.scores").optional({ nullable: true }).isArray(),
    body("assignments.*.scores.*.score").optional({ nullable: true }).isInt(),
    body("assignments.*.scores.*.studentId").isInt(),
    body("assignments.*.scores.*.isReturned").isBoolean(),
    validateRequest,
  ],
  create: [
    body("classId").isLength({ min: 1 }),
    body("title").isLength({ min: 1 }),
    body("type").isString().notEmpty().isIn(["exam", "exercise"]),
    body("deadline").optional().isISO8601().toDate(),
    body("description").optional().isString(),
    validateRequest,
  ],
  paramId: [param("id").isInt(), validateRequest],
};
