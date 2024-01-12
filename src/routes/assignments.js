const app = require("express");
const requireAuth = require("../middlewares/requireAuth");
const assignmentsController = require("../controllers/assignments");
const assignmentsValidator = require("../middlewares/validators/assignments");
const router = app.Router();

router.use(requireAuth);

/**
 * @swagger
 * /assignments/bulk:
 *   patch:
 *     tags: [Assignments]
 *     summary: For teacher update entire grade board
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               classId:
 *                 type: string
 *                 description: The ID of the class for which assignments are being created or updated.
 *                 example: "db66c91121"
 *                 required: true
 *               assignments:
 *                 type: array
 *                 description: An array of assignments to be created or updated.
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: The ID of the assignment. Omitted for new assignments.
 *                       example: 8
 *                     title:
 *                       type: string
 *                       description: The title of the assignment.
 *                       example: "1"
 *                       required: true
 *                     description:
 *                       type: string
 *                       description: The description of the assignment.
 *                       example: "12345123"
 *                     type:
 *                       type: string
 *                       description: The type of the assignment (e.g., "exam", "exercise").
 *                       example: "exam"
 *                       required: true
 *                     deadline:
 *                       type: string
 *                       format: date-time
 *                       description: The deadline for the assignment in ISO 8601 format.
 *                       example: "2023-12-28T22:48:27.635Z"
 *                     dateCreated:
 *                       type: string
 *                       format: date-time
 *                       description: The date and time when the assignment was created in ISO 8601 format.
 *                       example: "2023-12-29T15:54:51.155Z"
 *                     scores:
 *                       type: array
 *                       description: An array of scores associated with the assignment.
 *                       items:
 *                         type: object
 *                         properties:
 *                           score:
 *                             type: integer
 *                             description: The score for the student.
 *                             example: 10
 *                           studentId:
 *                             type: integer
 *                             description: The ID of the student.
 *                             example: 2
 *                           isReturned:
 *                             type: boolean
 *                             description: Indicates whether the score has been returned.
 *                             example: true
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
  "/bulk",
  assignmentsValidator.updateBulk,
  assignmentsController.updateBulk
);

/**
 * @swagger
 * /assignments:
 *   post:
 *     tags: [Assignments]
 *     summary: Create a new assignment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - classId
 *               - title
 *               - type
 *             properties:
 *               classId:
 *                 type: string
 *                 description: The ID of the class for which the assignment is being created.
 *                 example: "ec07ed2a6a"
 *               title:
 *                 type: string
 *                 description: The title of the assignment.
 *                 example: "title"
 *                 required: true
 *               description:
 *                 type: string
 *                 description: The description of the assignment.
 *                 example: "description"
 *               deadline:
 *                 type: string
 *                 format: date-time
 *                 description: The deadline for the assignment in ISO 8601 format.
 *                 example: "2023-12-28T22:48:27.635Z"
 *               type:
 *                 type: string
 *                 description: The type of the assignment (e.g., "exam", "exercise").
 *                 example: "exam"
 *                 required: true
 *     responses:
 *       '201':
 *         description: Successful creation of the assignment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the request was successful.
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: Additional data if needed (e.g., assignment ID, details).
 *                   example: {}
 *                 message:
 *                   type: string
 *                   description: A human-readable message describing the result of the operation.
 *                   example: "Assignment created successfully."
 */
router.post("", assignmentsValidator.create, assignmentsController.create);

/**
 * @swagger
 * /assignments/{id}:
 *   get:
 *     tags: [Assignments]
 *     summary: Get assignment details for student
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
router.get("/:id", assignmentsValidator.paramId, assignmentsController.getById);

module.exports = router;
