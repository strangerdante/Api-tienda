# API RESTful para Tienda en Línea

Una API completa para una tienda en línea con autenticación JWT, gestión de usuarios, productos y órdenes de compra.

## 🌟 Características

-  **Autenticación JWT** con registro e inicio de sesión
-  **Documentación Swagger** interactiva con aplicación automática de tokens
-  **Gestión de usuarios** autenticados con roles
-  **Catálogo de productos** con filtros avanzados, búsqueda y paginación
-  **Sistema de órdenes** con dirección de envío y múltiples productos
-  **Control de stock** automático y validación de inventario
-  **Estructura modular** y escalable
-  **Validación completa** de datos con express-validator
-  **Manejo de errores** estructurado
-  **Base de datos MongoDB** con Mongoose y índices optimizados
-  **Filtros avanzados** por categoría, precio, búsqueda de texto
-  **Middleware de autenticación** para rutas protegidas

## 🛠️ **Tecnologías**

La aplicación está construida con:
- **Runtime**: Node.js (v16+)
- **Framework**: Express.js v4.18.2
- **Base de Datos**: MongoDB con Mongoose v8.0.3
- **Autenticación**: JWT (jsonwebtoken v9.0.2)
- **Seguridad**: bcryptjs v2.4.3
- **Validación**: express-validator v7.0.1
- **Documentación**: Swagger (swagger-jsdoc v6.2.8, swagger-ui-express v5.0.1)
- **CORS**: cors v2.8.5

## 📋 Requisitos Previos

- Node.js (versión 16 o superior)
- MongoDB (instalado localmente o URI de conexión)
- npm o yarn

## 🚀 Instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd project
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
Crear un archivo `.env` en la raíz del proyecto:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/tienda-online
JWT_SECRET=tu_jwt_secret_super_seguro_aqui_2024
JWT_EXPIRE=24h
```

4. **Iniciar MongoDB**
Asegúrate de que MongoDB esté ejecutándose en tu sistema.

5. **Poblar la base de datos (opcional)**
```bash
node seeders/productSeeder.js
```

6. **Iniciar el servidor**
```bash
# Desarrollo (con nodemon)
npm run dev

# Producción
npm start
```

🌐 **Acceso a la aplicación:**
- **API**: `http://localhost:3000/api/`
- **Documentación Swagger**: `http://localhost:3000/api-docs` (redirección automática desde `/`)
- **Health Check**: `http://localhost:3000/api/health`

## 📖 Documentación de la API

### **🎯 Documentación Interactiva**
La API cuenta con **documentación Swagger completa** disponible en:
- **URL**: `http://localhost:3000/api-docs`
- **Características Especiales**:
  - 🔄 **Aplicación automática de tokens** después del login/registro
  - 🧪 **Pruebas en vivo** de todos los endpoints
  - 📝 **Esquemas completos** de request/response
  - 🎨 **Interfaz moderna** y fácil de usar

### **Base URL**
Todos los endpoints tienen el prefijo: `/api/`

### **🔐 Autenticación** (`/api/auth/`)

| Método | Endpoint | Descripción | Autenticación | Validación |
|--------|----------|-------------|---------------|------------|
| POST | `/api/auth/register` | Registro de nuevo usuario | ❌ | ✅ |
| POST | `/api/auth/login` | Inicio de sesión | ❌ | ✅ |

#### Registro de Usuario
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "password": "123456"
}
```

**Validaciones:**
- `name`: 2-50 caracteres
- `email`: formato de email válido
- `password`: mínimo 6 caracteres

#### Inicio de Sesión
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "juan@ejemplo.com",
  "password": "123456"
}
```

### **👤 Usuario** (`/api/`)

| Método | Endpoint | Descripción | Autenticación | Validación |
|--------|----------|-------------|---------------|------------|
| GET | `/api/me` | Obtener perfil del usuario autenticado | ✅ | ❌ |

#### Obtener datos del usuario autenticado
```http
GET /api/me
Authorization: Bearer <token>
```

**Respuesta:**
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Juan Pérez",
    "email": "juan@ejemplo.com",
    "role": "user",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### **🛍️ Productos** (`/api/`)

| Método | Endpoint | Descripción | Autenticación | Filtros/Paginación |
|--------|----------|-------------|---------------|-------------------|
| GET | `/api/products` | Obtener todos los productos | ❌ | ✅ |
| GET | `/api/products/:id` | Obtener producto por ID | ❌ | ❌ |

#### Listar productos con filtros
```http
GET /api/products?page=1&limit=10&category=Electrónicos&minPrice=100&maxPrice=5000&search=iPhone
```

**Parámetros de consulta disponibles:**
- `page`: Número de página (default: 1)
- `limit`: Productos por página (default: 10)
- `category`: Filtrar por categoría
- `minPrice`: Precio mínimo
- `maxPrice`: Precio máximo  
- `search`: Búsqueda en nombre y descripción

**Respuesta:**
```json
{
  "success": true,
  "products": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

#### Obtener producto por ID
```http
GET /api/products/:id
```

### **📦 Órdenes** (`/api/`)

| Método | Endpoint | Descripción | Autenticación | Validación |
|--------|----------|-------------|---------------|------------|
| POST | `/api/orders` | Crear nueva orden | ✅ | ✅ |
| GET | `/api/orders` | Obtener órdenes del usuario | ✅ | Paginación |

#### Crear orden
```http
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "productId": "507f1f77bcf86cd799439011",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "street": "Calle Principal 123",
    "city": "Ciudad de México",
    "state": "CDMX",
    "zipCode": "12345",
    "country": "México"
  }
}
```

**Validaciones:**
- `items`: Array con al menos 1 producto
- `productId`: ID válido de MongoDB
- `quantity`: Entero mayor a 0
- `shippingAddress`: Todos los campos requeridos
- **Control automático de stock** y cálculo de total

#### Obtener órdenes del usuario
```http
GET /api/orders?page=1&limit=10
Authorization: Bearer <token>
```

**Parámetros disponibles:**
- `page`: Número de página (default: 1)
- `limit`: Órdenes por página (default: 10)

### **⚙️ Sistema**

| Método | Endpoint | Descripción | Autenticación | Validación |
|--------|----------|-------------|---------------|------------|
| GET | `/api/health` | Health check de la aplicación | ❌ | ❌ |
| GET | `/` | Redirección automática a `/api-docs` | ❌ | ❌ |
| GET | `/welcome` | Información de bienvenida y endpoints | ❌ | ❌ |

#### Health Check
```http
GET /api/health
```

**Respuesta:**
```json
{
  "message": "API funcionando correctamente con MongoDB",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0",
  "database": "MongoDB",
  "documentation": "/api-docs"
}
```

## ⚡ **Características Técnicas**

### **🔒 Seguridad y Autenticación**
- **JWT Tokens**: Autenticación basada en tokens con expiración configurable
- **Middleware de Autorización**: Protección automática de rutas sensibles
- **Bcrypt**: Encriptación de contraseñas con salt rounds
- **CORS**: Configuración de políticas de origen cruzado

### **🗄️ Base de Datos**
- **MongoDB**: Base de datos NoSQL con Mongoose ODM
- **Índices Optimizados**: Para mejorar rendimiento en consultas
- **Validaciones**: A nivel de esquema y aplicación
- **Referencias**: Entre colecciones (User, Product, Order)

### **📊 Funcionalidades Avanzadas**
- **Paginación**: En productos y órdenes del usuario
- **Filtros**: Por categoría, precio, búsqueda de texto
- **Control de Stock**: Validación automática antes de crear órdenes
- **Cálculo Automático**: Total de órdenes basado en precio × cantidad
- **Estados de Orden**: `pending`, `processing`, `shipped`, `delivered`, `cancelled`

### **🛠️ Arquitectura**
- **Patrón MVC**: Separación clara de responsabilidades
- **Controladores Específicos**: 
  - `authController.js` - Autenticación y registro
  - `productController.js` - CRUD de productos con filtros
  - `orderController.js` - Gestión completa de órdenes
  - `userController.js` - Perfil de usuario
- **Middleware Modular**: Autenticación reutilizable
- **Validaciones Centralizadas**: express-validator en rutas

## 📁 Estructura del Proyecto

```
project/
├── app.js                  # 🚀 Configuración principal de Express y servidor
├── index.js                # 📄 Archivo de prueba (Hello Node.js)
├── package.json            # 📦 Dependencias y scripts del proyecto
├── package-lock.json       # 🔒 Versiones exactas de dependencias
├── README.md               # 📖 Documentación del proyecto
├── config/
│   ├── database.js         # 🗄️ Configuración de conexión a MongoDB
│   └── swagger.js          # 📚 Configuración de documentación Swagger
├── controllers/
│   ├── authController.js   # 🔐 Lógica de autenticación (login/register)
│   ├── orderController.js  # 📦 Lógica de gestión de órdenes
│   ├── productController.js# 🛍️ Lógica de gestión de productos
│   └── userController.js   # 👤 Lógica de gestión de usuarios
├── middleware/
│   └── auth.js             # 🛡️ Middleware de autenticación JWT
├── models/
│   ├── Order.js            # 📄 Modelo de órdenes (Mongoose)
│   ├── Product.js          # 📄 Modelo de productos (Mongoose)
│   └── User.js             # 📄 Modelo de usuarios (Mongoose)
├── routes/
│   ├── auth.js             # 🔗 Rutas de autenticación
│   ├── orders.js           # 🔗 Rutas de órdenes
│   ├── products.js         # 🔗 Rutas de productos
│   └── user.js             # 🔗 Rutas de usuario
└── seeders/
    └── productSeeder.js    # 🌱 Script para poblar productos de prueba
```

## 🔐 Seguridad

### **Autenticación y Autorización**
-  **Contraseñas seguras**: Hasheadas con bcryptjs antes de almacenar
-  **JWT Tokens**: Con expiración configurable (default: 24h)
-  **Middleware de protección**: Validación automática en rutas sensibles
-  **Control de usuarios**: Estados activo/inactivo
-  **Roles de usuario**: Sistema preparado para `user`/`admin`

### **Validaciones y Filtros**
-  **express-validator**: Validación completa de datos de entrada
-  **Sanitización**: Limpieza automática de datos
-  **Normalización**: Emails en formato estándar
-  **Validación de ObjectIDs**: Para referencias de MongoDB

### **Protección de Datos**
-  **Estados de recursos**: Productos/usuarios activos vs inactivos
-  **Control de stock**: Prevención de órdenes sin inventario
-  **CORS configurado**: Políticas de acceso por dominio

## 🧪 Pruebas de la API

### **🎯 Opción Recomendada: Swagger UI**
La forma más fácil de probar la API es usando la **documentación interactiva**:

1. **Abrir Swagger**: `http://localhost:3000/api-docs`
2. **Registrar usuario** → El token se aplica automáticamente ✨
3. **Probar endpoints** → Interfaz amigable con validaciones
4. **Ver respuestas** → Formato JSON con esquemas completos

### **📬 Pruebas con Postman/Thunder Client**

#### **Flujo de Autenticación:**
1. **Registrar usuario** (`POST /api/auth/register`)
   ```json
   {
     "name": "Usuario Prueba",
     "email": "test@example.com", 
     "password": "123456"
   }
   ```

2. **Iniciar sesión** (`POST /api/auth/login`) → Copiar `token`

3. **Configurar Authorization**: `Bearer <token>`

#### **Flujo de Compra:**
4. **Ver productos** (`GET /api/products`) → No requiere auth
5. **Filtrar productos** (`GET /api/products?category=Electrónicos&maxPrice=1000`)
6. **Crear orden** (`POST /api/orders`) → Requiere auth + dirección
7. **Ver historial** (`GET /api/orders`) → Requiere auth

## 📊 Modelos de Datos

### **👤 Usuario**
```javascript
{
  "_id": "ObjectId",
  "name": "String (2-50 chars)",
  "email": "String (unique, valid email)",
  "password": "String (hashed)",
  "role": "String (user|admin)",
  "isActive": "Boolean",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### **🛍️ Producto**
```javascript
{
  "_id": "ObjectId",
  "name": "String (2-100 chars)",
  "description": "String (max 500 chars)",
  "price": "Number (min: 0)",
  "category": "String",
  "stock": "Number (min: 0)",
  "image": "String (URL)",
  "isActive": "Boolean",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### **📦 Orden**
```javascript
{
  "_id": "ObjectId",
  "user": "ObjectId (ref: User)",
  "items": [{
    "product": "ObjectId (ref: Product)",
    "quantity": "Number (min: 1)",
    "price": "Number"
  }],
  "total": "Number (auto-calculated)",
  "status": "String (pending|processing|shipped|delivered|cancelled)",
  "shippingAddress": {
    "street": "String",
    "city": "String", 
    "state": "String",
    "zipCode": "String",
    "country": "String (default: México)"
  },
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## 📋 Códigos de Estado HTTP

- `200` -  Éxito
- `201` -  Creado exitosamente
- `400` -  Solicitud incorrecta (datos inválidos)
- `401` -  No autorizado (token inválido/faltante)
- `403` -  Prohibido (sin permisos)
- `404` -  No encontrado
- `500` -  Error interno del servidor

---

## 🚀 **Comandos Rápidos**

```bash
# Instalar e iniciar
npm install && npm run dev

# Poblar datos de prueba
node seeders/productSeeder.js

# Documentación
http://localhost:3000/api-docs
```

**¡Listo para usar! 🎉**
