const express = require("express");
const router = express.Router();
const { login, logout } = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/authMiddleware");

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user (admin or regular user)
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
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Login berhasil
 *       401:
 *         description: Email atau password salah
 */
router.post("/login", login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout berhasil
 */
router.post("/logout", authMiddleware(), logout);

module.exports = router;

