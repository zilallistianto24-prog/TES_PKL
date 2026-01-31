const express = require("express");
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  updateStatus,
  deleteTask,
} = require("../controllers/task.controller");
const authMiddleware = require("../middleware/authMiddleware");

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: List all tasks
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil data task
 */
router.get("/", authMiddleware(), getTasks);

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get single task
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 */
router.get("/:id", authMiddleware(), getTask);

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create task
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               user_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Task berhasil dibuat
 */
router.post("/", authMiddleware(), createTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update detail task
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               user_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Task berhasil diupdate
 */
router.put("/:id", authMiddleware(), updateTask);

/**
 * @swagger
 * /api/tasks/{id}/status:
 *   patch:
 *     summary: Update status task
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status task berhasil diupdate
 */
router.patch("/:id/status", authMiddleware(), updateStatus);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete task
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task berhasil dihapus
 */
router.delete("/:id", authMiddleware(), deleteTask);

module.exports = router;
