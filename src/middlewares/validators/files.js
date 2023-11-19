const { param } = require("express-validator");
const validateRequest = require("./validatorRequest.js");

module.exports = {
  get: [param("id").isLength({ min: 8 }), validateRequest],
};
