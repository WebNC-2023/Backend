const app = require("express");
const requireAuth = require("../middlewares/requireAuth");
const requireAdmin = require("../middlewares/requireAdmin");
const usersController = require("../controllers/users");
const usersValidator = require("../middlewares/validators/users");
const upload = require("../configs/upload");

const router = app.Router();
router.use(requireAuth);

/**
 * @swagger
 * tags:
 *   name: Users
 */

/**
 * @swagger
 * /users/update-profile:
 *   patch:
 *     tags: [Users]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: firstName
 *               lastName:
 *                 type: string
 *                 example: lastName
 *               avatar:
 *                 type: string
 *                 format: binary
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

router.patch(
  "/update-profile",
  usersValidator.updateProfile,
  upload.single("avatar"),
  usersController.updateProfile
);

/**
 * @swagger
 * /users/change-password:
 *   patch:
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: currentPassword
 *               newPassword:
 *                 type: string
 *                 example: newPassword
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
router.patch(
  "/change-password",
  usersValidator.changePassword,
  usersController.changePassword
);

/**
 * @swagger
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: For admin
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
router.get("", requireAdmin, usersController.getAll);

/**
 * @swagger
 * /users/{id}/block:
 *   get:
 *     tags: [Users]
 *     summary: For admin
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
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
router.post("/:id/block", requireAdmin, usersController.block);

/**
 * @swagger
 * /users/{id}/unblock:
 *   get:
 *     tags: [Users]
 *     summary: For admin
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
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
router.post("/:id/unblock", requireAdmin, usersController.unblock);

module.exports = router;
