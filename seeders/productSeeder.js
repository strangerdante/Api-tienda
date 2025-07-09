const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

// Conectar a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tienda-online');
    console.log('✅ Conectado a MongoDB para seeding');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    process.exit(1);
  }
};

const products = [
  {
    name: 'Laptop Gaming ASUS ROG',
    description: 'Laptop para gaming con procesador Intel i7, 16GB RAM, RTX 4060',
    price: 4500000,
    category: 'Electrónicos',
    stock: 15,
    image: 'https://via.placeholder.com/300x300?text=Laptop+Gaming'
  },
  {
    name: 'iPhone 15 Pro',
    description: 'Smartphone Apple iPhone 15 Pro con chip A17 Pro, 128GB',
    price: 5200000,
    category: 'Electrónicos',
    stock: 25,
    image: 'https://via.placeholder.com/300x300?text=iPhone+15'
  },
  {
    name: 'Auriculares Sony WH-1000XM5',
    description: 'Auriculares inalámbricos con cancelación de ruido',
    price: 1200000,
    category: 'Audio',
    stock: 30,
    image: 'https://via.placeholder.com/300x300?text=Auriculares+Sony'
  },
  {
    name: 'Smart TV Samsung 55"',
    description: 'Televisor Samsung QLED 4K UHD de 55 pulgadas',
    price: 3200000,
    category: 'Electrónicos',
    stock: 10,
    image: 'https://via.placeholder.com/300x300?text=Smart+TV'
  },
  {
    name: 'Consola PlayStation 5',
    description: 'Consola de videojuegos Sony PlayStation 5 con SSD 825GB',
    price: 2400000,
    category: 'Gaming',
    stock: 8,
    image: 'https://via.placeholder.com/300x300?text=PlayStation+5'
  },
  {
    name: 'Tablet iPad Air',
    description: 'iPad Air con chip M1, pantalla de 10.9 pulgadas, 64GB',
    price: 2800000,
    category: 'Electrónicos',
    stock: 20,
    image: 'https://via.placeholder.com/300x300?text=iPad+Air'
  },
  {
    name: 'Cámara Canon EOS R6',
    description: 'Cámara profesional Canon EOS R6 Mark II con lente 24-105mm',
    price: 7500000,
    category: 'Fotografía',
    stock: 5,
    image: 'https://via.placeholder.com/300x300?text=Canon+R6'
  },
  {
    name: 'Smartwatch Apple Watch Series 9',
    description: 'Reloj inteligente Apple Watch Series 9 de 45mm',
    price: 1500000,
    category: 'Wearables',
    stock: 35,
    image: 'https://via.placeholder.com/300x300?text=Apple+Watch'
  }
];

const seedProducts = async () => {
  try {
    await connectDB();
    
    // Limpiar productos existentes
    await Product.deleteMany({});
    console.log('🗑️  Productos existentes eliminados');
    
    // Insertar nuevos productos
    const insertedProducts = await Product.insertMany(products);
    console.log(`✅ ${insertedProducts.length} productos insertados exitosamente`);
    
    console.log('📊 Productos creados:');
    insertedProducts.forEach(product => {
      console.log(`   • ${product.name} - $${product.price}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seeding:', error);
    process.exit(1);
  }
};

// Ejecutar seeding
if (require.main === module) {
  seedProducts();
}

module.exports = { seedProducts, products };