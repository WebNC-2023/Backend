const app = require("express");
const router = app.Router();
const filesController = require("../controllers/files");
const filesValidator = require("../middlewares/validators/files");

/**
 * @swagger
 * tags:
 *   name: Files
 */

/**
 * @swagger
 * /files/{id}:
 *   get:
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '302':
 *         description: Redirect
 *         headers:
 *           location:
 *             schema:
 *               type: string
 */
router.get("/:id", filesValidator.get, filesController.get);

module.exports = router;
