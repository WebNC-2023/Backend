const app = require("express");
const router = app.Router();
const authController = require("../controllers/auth");
const authValidator = require("../middlewares/validators/auth");
const requireAuth = require("../middlewares/requireAuth");
const {
  googleAuth,
  googleAuthCallback,
  facebookAuth,
  facebookAuthCallback,
} = require("../middlewares/passportStrategy");

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
 *   get:
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
router.get("/me", requireAuth, authController.getMe);

/**
 * @swagger
 * /auth/refresh:
 *   get:
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
router.get("/refresh", authController.refresh);

/**
 * @swagger
 * /auth/google:
 *   get:
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
router.get("/google", googleAuth);
router.get("/google/callback", googleAuthCallback, authController.ssoSignIn);

/**
 * @swagger
 * /auth/facebook:
 *   get:
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
router.get("/facebook", facebookAuth);
router.get(
  "/facebook/callback",
  facebookAuthCallback,
  authController.ssoSignIn
);

/**
 * @swagger
 * /auth/active-account/{activeCode}:
 *   post:
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: activeCode
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
router.post(
  "/active-account/:activeCode",
  authValidator.activeAccount,
  authController.activeAccount
);

/**
 * @swagger
 * /auth/forgot-password:
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
  "/forgot-password",
  authValidator.forgotPassword,
  authController.sendMailResetPassword
);

/**
 * @swagger
 * /auth/validate-reset-password-code:
 *   post:
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               resetPasswordCode:
 *                 type: string
 *                 example: 2befdf042e98e6b5
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
  "/validate-reset-password-code",
  authValidator.validateResetPasswordCode,
  authController.validateResetPasswordCode
);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               resetPasswordCode:
 *                 type: string
 *                 example: 2befdf042e98e6b5
 *               newPassword:
 *                 type: string
 *                 example: 12345678
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
  "/reset-password",
  authValidator.resetPassword,
  authController.resetPassword
);

module.exports = router;
