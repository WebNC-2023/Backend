const app = require("express");
const requireAuth = require("../middlewares/requireAuth");
const notificationsController = require("../controllers/notifications");
const router = app.Router();

router.use(requireAuth);

/**
 * @swagger
 * /notifications:
 *   get:
 *     tags: [Notifications]
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
router.get("", notificationsController.get);

/**
 * @swagger
 * /notifications/read/{id}:
 *   post:
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
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
router.post("/read/:id", notificationsController.markAsRead);

/**
 * @swagger
 * /notifications/read-all:
 *   post:
 *     tags: [Notifications]
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
router.post("/read-all", notificationsController.markAllAsRead);

module.exports = router;
