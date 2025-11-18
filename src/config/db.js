const mongoose = require('mongoose');

let isConnected = false; // 🔥 Persistencia entre llamadas serverless

const connectDB = async () => {
  if (isConnected) {
    // 💡 Si ya hay conexión previa en Vercel NO reconectes
    return;
  }

  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('❌ Falta la variable de entorno MONGO_URI en Vercel.');
  }

  try {
    mongoose.set('strictQuery', true);

    const conn = await mongoose.connect(mongoUri, {
      maxPoolSize: 10,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000
    });

    isConnected = conn.connections[0].readyState === 1;

    console.log("✅ MongoDB conectado (serverless)");
  } catch (error) {
    console.error("❌ Error al conectar:", error);
    throw new Error("Error conectando a MongoDB");
  }
};

module.exports = connectDB;
