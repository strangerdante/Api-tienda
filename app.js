const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const { swaggerUi, specs } = require('./config/swagger');

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

// Importar rutas
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');

// Crear aplicación Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: `
    .swagger-ui .topbar { display: none }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .auth-notification {
      animation: fadeIn 0.5s ease-in;
    }
  `,
  customSiteTitle: "API Tienda en Línea - Documentación",
  swaggerOptions: {
    onComplete: function() {
      // Inicializar variable para evitar notificaciones duplicadas
      window.lastTokenApplied = null;
    },
    requestInterceptor: function(request) {
      return request;
    },
    responseInterceptor: function(response) {
      // Detectar respuestas de login exitoso y aplicar token automáticamente
      if ((response.url.includes('/auth/login') || response.url.includes('/auth/register')) && 
          (response.status === 200 || response.status === 201)) {
        try {
          const data = JSON.parse(response.text);
          if (data.token && data.token !== window.lastTokenApplied) {
            // Evitar notificaciones duplicadas
            window.lastTokenApplied = data.token;
            
            // Aplicar token automáticamente a la autorización
            setTimeout(() => {
              const ui = window.ui;
              if (ui) {
                ui.authActions.authorize({
                  bearerAuth: {
                    name: 'bearerAuth',
                    schema: {
                      type: 'http',
                      scheme: 'bearer'
                    },
                    value: data.token
                  }
                });
                
                // Mostrar notificación de éxito
                console.log('🔐 Token aplicado');
                
                // Verificar si ya existe una notificación activa
                const existingNotification = document.querySelector('.auth-notification');
                if (existingNotification) {
                  existingNotification.remove();
                }
                
                // Mostrar mensaje en la interfaz en posición fija
                const notification = document.createElement('div');
                notification.className = 'auth-notification';
                notification.style.cssText = `
                  position: fixed;
                  top: 20px;
                  right: 20px;
                  background: #49cc90;
                  color: white;
                  padding: 12px 16px;
                  border-radius: 6px;
                  text-align: center;
                  font-weight: 500;
                  box-shadow: 0 4px 12px rgba(73, 204, 144, 0.4);
                  z-index: 9999;
                  max-width: 300px;
                `;
                notification.innerHTML = '🔐 Token aplicado';
                document.body.appendChild(notification);
                
                // Remover notificación después de 5 segundos con animación
                setTimeout(() => {
                  if (notification && notification.parentNode) {
                    notification.style.transition = 'all 0.3s ease-out';
                    notification.style.opacity = '0';
                    notification.style.transform = 'translateY(-10px)';
                    setTimeout(() => {
                      if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                      }
                    }, 300);
                  }
                }, 5000);
              }
            }, 100);
          }
        } catch (e) {
          console.error('Error procesando respuesta de autenticación:', e);
        }
      }
      return response;
    }
  }
}));

// Ruta raíz - Redirección a documentación
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// Página de bienvenida alternativa (opcional)
app.get('/welcome', (req, res) => {
  res.json({
    message: '🎉 Bienvenido a la API Tienda en Línea',
    description: 'API RESTful para una tienda en línea con autenticación JWT',
    version: '1.0.0',
    documentation: {
      swagger: '/api-docs',
      description: 'Documentación interactiva de la API'
    },
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      products: '/api/products',
      orders: '/api/orders',
      user: '/api/me'
    },
    developer: {
      name: 'Desarrollador',
      contact: 'dev@tienda.com'
    }
  });
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/api', productRoutes);
app.use('/api', orderRoutes);

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check de la API
 *     tags: [Sistema]
 *     responses:
 *       200:
 *         description: API funcionando correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: API funcionando correctamente con MongoDB
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 version:
 *                   type: string
 *                   example: 1.0.0
 *                 database:
 *                   type: string
 *                   example: MongoDB
 *                 documentation:
 *                   type: string
 *                   example: /api-docs
 */
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'API funcionando correctamente con MongoDB',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    database: 'MongoDB',
    documentation: '/api-docs'
  });
});

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🗄️ Base de datos: MongoDB`);
});

module.exports = app;