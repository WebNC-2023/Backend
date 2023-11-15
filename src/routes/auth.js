const app = require("express");
const router = app.Router();
const authController = require("../controllers/auth");
const authValidator = require("../middlewares/validators/auth");
const authenticateToken = require("../middlewares/authenticateToken");

/**
 * @swagger
 * tags:
 *   name: Auth
 */

/**
 * @swagger
 * /auth/sign-up:
 *   post:
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Leanne
 *               lastName:
 *                 type: string
 *                 example: Graham
 *               email:
 *                 type: string
 *                 example: LeanneGraham@gmail.com
 *               password:
 *                 type: string
 *                 example: password
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
router.post("/sign-up", authValidator.signUp, authController.signUp);

/**
 * @swagger
 * /auth/sign-in:
 *   post:
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: LeanneGraham@gmail.com
 *               password:
 *                 type: string
 *                 example: password
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
router.post("/sign-in", authValidator.signIn, authController.signIn);

/**
 * @swagger
 * /auth/sign-out:
 *   post:
 *     tags: [Auth]
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
router.post("/sign-out", authController.signOut);

/**
 * @swagger
 * /auth/me:
 *   post:
 *     tags: [Auth]
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
router.post("/me", authenticateToken, authController.getMe);

module.exports = router;
