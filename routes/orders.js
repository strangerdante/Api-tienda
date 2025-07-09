const express = require('express');
const { body } = require('express-validator');
const { auth } = require('../middleware/auth');
const { createOrder, getUserOrders } = require('../controllers/orderController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Órdenes
 *   description: Endpoints para gestión de órdenes de compra
 */

// Validaciones
const createOrderValidation = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Se requiere al menos un producto'),
  body('items.*.productId')
    .isMongoId()
    .withMessage('ID de producto inválido'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('La cantidad debe ser mayor a 0'),
  body('shippingAddress.street')
    .trim()
    .notEmpty()
    .withMessage('La calle es requerida'),
  body('shippingAddress.city')
    .trim()
    .notEmpty()
    .withMessage('La ciudad es requerida'),
  body('shippingAddress.state')
    .trim()
    .notEmpty()
    .withMessage('El estado es requerido'),
  body('shippingAddress.zipCode')
    .trim()
    .notEmpty()
    .withMessage('El código postal es requerido')
];

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Crear nueva orden
 *     tags: [Órdenes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - shippingAddress
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: "507f1f77bcf86cd799439011"
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *                       example: 2
 *               shippingAddress:
 *                 type: object
 *                 required:
 *                   - street
 *                   - city
 *                   - state
 *                   - zipCode
 *                 properties:
 *                   street:
 *                     type: string
 *                     example: "Calle Principal 123"
 *                   city:
 *                     type: string
 *                     example: "Ciudad de México"
 *                   state:
 *                     type: string
 *                     example: "CDMX"
 *                   zipCode:
 *                     type: string
 *                     example: "12345"
 *                   country:
 *                     type: string
 *                     default: "México"
 *                     example: "México"
 *     responses:
 *       201:
 *         description: Orden creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Orden creada exitosamente
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Datos inválidos o stock insuficiente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
router.post('/orders', auth, createOrderValidation, createOrder);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Obtener historial de órdenes del usuario
 *     tags: [Órdenes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Órdenes por página
 *     responses:
 *       200:
 *         description: Historial de órdenes obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     total:
 *                       type: integer
 *                       example: 25
 *                     pages:
 *                       type: integer
 *                       example: 3
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
router.get('/orders', auth, getUserOrders);

module.exports = router;