const app = require("express");
const requireAuth = require("../middlewares/requireAuth");
const classesController = require("../controllers/classes");
const classesValidator = require("../middlewares/validators/classes");
const upload = require("../configs/upload");
const requireAdmin = require("../middlewares/requireAdmin");

const router = app.Router();

/**
 * @swagger
 * tags:
 *   name: Classes
 */

/**
 * @swagger
 * /classes:
 *   post:
 *     tags: [Classes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 required: true
 *               part:
 *                 type: string
 *               topic:
 *                 type: string
 *               room:
 *                 type: string
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
router.post("", requireAuth, classesValidator.create, classesController.create);

/**
 * @swagger
 * /classes:
 *   get:
 *     tags: [Classes]
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
 *                   type: array
 *                   items:
 *                     type: object
 *                 message:
 *                   type: string
 */
router.get("", requireAuth, classesController.getAll);

/**
 * @swagger
 * /classes/{id}:
 *   get:
 *     tags: [Classes]
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
router.get(
  "/:id",
  requireAuth,
  classesValidator.paramId,
  classesController.getById
);

/**
 * @swagger
 * /classes/{id}/find:
 *   get:
 *     description: 'Find class that not attend'
 *     tags: [Classes]
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
router.get("/:id/find", classesValidator.paramId, classesController.findById);

/**
 * @swagger
 * /classes/{id}:
 *   patch:
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               part:
 *                 type: string
 *               topic:
 *                 type: string
 *               room:
 *                 type: string
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
  "/:id",
  requireAuth,
  classesValidator.update,
  upload.single("avatar"),
  classesController.update
);

/**
 * @swagger
 * /classes/{id}:
 *   delete:
 *     tags: [Classes]
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
router.delete(
  "/:id",
  requireAuth,
  classesValidator.paramId,
  classesController.delete
);

/**
 * @swagger
 * /classes/{id}/attend:
 *   post:
 *     tags: [Classes]
 *     description: Only student
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
  "/:id/attend",
  requireAuth,
  classesValidator.paramId,
  classesController.attend
);

/**
 * @swagger
 * /classes/{id}/leave:
 *   post:
 *     tags: [Classes]
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
router.post(
  "/:id/leave",
  requireAuth,
  classesValidator.paramId,
  classesController.leave
);

/**
 * @swagger
 * /classes/{id}/remove-member:
 *   post:
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: userId want to remove
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
  "/:id/remove-member",
  requireAuth,
  classesValidator.removeMember,
  classesController.removeMember
);

/**
 * @swagger
 * /classes/{id}/invite:
 *   post:
 *     tags: [Classes]
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
 *             properties:
 *               email:
 *                 type: string
 *               role:
 *                 enum: [teacher, student]
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
  "/:id/invite",
  requireAuth,
  classesValidator.invite,
  classesController.invite
);

/**
 * @swagger
 * /classes/{id}/accept:
 *   post:
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
  "/:id/accept",
  requireAuth,
  classesValidator.paramId,
  classesController.accept
);

/**
 * @swagger
 * /classes/{id}/inactive:
 *   post:
 *     tags: [Classes]
 *     summary: For admin
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
router.post(
  "/:id/inactive",
  requireAuth,
  requireAdmin,
  classesValidator.paramId,
  classesController.inactive
);

/**
 * @swagger
 * /classes/{id}/active:
 *   post:
 *     tags: [Classes]
 *     summary: For admin
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
router.post(
  "/:id/active",
  requireAuth,
  requireAdmin,
  classesValidator.paramId,
  classesController.active
);

module.exports = router;
