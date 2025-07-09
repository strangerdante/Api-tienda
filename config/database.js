const mongoose = require('mongoose');

// Configuración de conexión a MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tienda-online', {
      // No necesitamos useNewUrlParser y useUnifiedTopology en versiones recientes de mongoose
    });

    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
    
    // Configurar eventos de conexión
    mongoose.connection.on('connected', () => {
      console.log('📦 Mongoose conectado a MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ Error de conexión MongoDB:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('📦 Mongoose desconectado de MongoDB');
    });

    // Cerrar conexión cuando la aplicación se cierre
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🔒 Conexión MongoDB cerrada por terminación de la aplicación');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;