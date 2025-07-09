const express = require('express');
const { auth } = require('../middleware/auth');
const { getMe } = require('../controllers/userController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Usuario
 *   description: Endpoints para gestión de usuario autenticado
 */

/**
 * @swagger
 * /me:
 *   get:
 *     summary: Obtener datos del usuario autenticado
 *     tags: [Usuario]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del usuario obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Token inválido o no proporcionado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/me', auth, getMe);

module.exports = router;