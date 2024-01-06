const app = require("express");
const requireAuth = require("../middlewares/requireAuth");
const scoresController = require("../controllers/scores");
const scoresValidator = require("../middlewares/validators/scores");

const router = app.Router();

router.use(requireAuth);

/**
 * @swagger
 * /scores/{scoreId}/request-review:
 *   post:
 *     tags: [Scores]
 *     summary: For student request review
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - expectScore
 *               - explanation
 *             properties:
 *               expectScore:
 *                 type: integer
 *                 description: The expected score for the review.
 *                 example: 100
 *               explanation:
 *                 type: string
 *                 description: The explanation or reason for the review request.
 *                 example: "need review"
 *     responses:
 *       '201':
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 */
router.post(
  "/:id/request-review",
  scoresValidator.requestReview,
  scoresController.requestReview
);

/**
 * @swagger
 * /scores/reviews/{reviewId}:
 *   get:
 *     tags: [Scores]
 *     summary: For teacher get review details
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 */
router.get(
  "/reviews/:reviewId",
  scoresValidator.getReviewDetail,
  scoresController.getReviewDetail
);

/**
 * @swagger
 * /scores/reviews/{reviewId}/score-again:
 *   post:
 *     tags: [Scores]
 *     summary: For teacher re-score
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - scoreAgain
 *             properties:
 *               scoreAgain:
 *                 type: integer
 *                 example: 100
 *     responses:
 *       '200':
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 */
router.post(
  "/reviews/:reviewId/score-again",
  scoresValidator.scoreAgain,
  scoresController.scoreAgain
);

/**
 * @swagger
 * /scores/reviews/{reviewId}/comments:
 *   post:
 *     tags: [Scores]
 *     summary: For teacher or student comment into review
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - comment
 *             properties:
 *               comment:
 *                 type: string
 *     responses:
 *       '200':
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 */
router.post(
  "/reviews/:reviewId/comments",
  scoresValidator.comment,
  scoresController.createComment
);

module.exports = router;
