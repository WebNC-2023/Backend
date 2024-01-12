const { body, param } = require("express-validator");
const validateRequest = require("./validatorRequest.js");

module.exports = {
  requestReview: [
    param("id").isInt(),
    body("expectScore").isInt(),
    body("explanation").isLength({ min: 1 }),
    validateRequest,
  ],
  getReviewDetail: [param("reviewId").isInt(), validateRequest],
  scoreAgain: [
    param("reviewId").isInt(),
    body("scoreAgain").isInt(),
    validateRequest,
  ],
  comment: [
    param("reviewId").isInt(),
    body("comment").isLength({ min: 1 }),
    validateRequest,
  ],
};
