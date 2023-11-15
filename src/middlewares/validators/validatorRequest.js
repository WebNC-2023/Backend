const { validationResult } = require("express-validator");

const validateRequest = (req, res, next) => {
  const validate = validationResult(req);
  if (validate.errors.length !== 0) {
    res.status(400).send({ success: false, errors: validate.errors });
  } else {
    next();
  }
};

module.exports = validateRequest;
