const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Tienda en Línea',
      version: '1.0.0',
      description: 'API RESTful para una tienda en línea con autenticación JWT, gestión de usuarios, productos y órdenes de compra.',
      // contact eliminado
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Servidor de desarrollo'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            name: { type: 'string', example: 'Juan Pérez' },
            email: { type: 'string', example: 'juan@ejemplo.com' },
            role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
            isActive: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Product: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            name: { type: 'string', example: 'iPhone 15 Pro' },
            description: { type: 'string', example: 'Smartphone Apple iPhone 15 Pro con chip A17 Pro' },
            price: { type: 'number', example: 28999.99 },
            category: { type: 'string', example: 'Electrónicos' },
            stock: { type: 'integer', example: 25 },
            image: { type: 'string', example: 'https://via.placeholder.com/300x300' },
            isActive: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Order: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            user: { type: 'string', example: '507f1f77bcf86cd799439012' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  product: { type: 'string', example: '507f1f77bcf86cd799439013' },
                  quantity: { type: 'integer', example: 2 },
                  price: { type: 'number', example: 999.99 }
                }
              }
            },
            total: { type: 'number', example: 1999.98 },
            status: { type: 'string', enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], example: 'pending' },
            shippingAddress: {
              type: 'object',
              properties: {
                street: { type: 'string', example: 'Calle Principal 123' },
                city: { type: 'string', example: 'Ciudad de México' },
                state: { type: 'string', example: 'CDMX' },
                zipCode: { type: 'string', example: '12345' },
                country: { type: 'string', example: 'México' }
              }
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error message' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  msg: { type: 'string' },
                  param: { type: 'string' },
                  location: { type: 'string' }
                }
              }
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operación exitosa' }
          }
        }
      }
    }
  },
  apis: ['./routes/auth.js', './routes/products.js', './routes/orders.js', './routes/user.js', './app.js'], // Orden específico: Autenticación, Productos, Órdenes
};

const specs = swaggerJSDoc(options);

module.exports = {
  swaggerUi,
  specs
}; 