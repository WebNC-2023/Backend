const app = require("express");
const authenticateToken = require("../middlewares/authenticateToken");
const usersController = require("../controllers/users");
const usersValidator = require("../middlewares/validators/users");

const router = app.Router();
router.use(authenticateToken);

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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: firstName (optional)
 *               lastName:
 *                 type: string
 *                 example: lastName (optional)
 *               avatar:
 *                 type: string
 *                 example: avatar (optional)
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
 *                   type: string
 *                 message:
 *                   type: object
 */

router.patch(
  "/update-profile",
  usersValidator.updateProfile,
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
 *                   type: string
 *                 message:
 *                   type: object
 */
router.patch(
  "/change-password",
  usersValidator.changePassword,
  usersController.changePassword
);

module.exports = router;
