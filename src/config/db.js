const mongoose = require('mongoose');

let isConnected = false; // 🔥 Persistente entre invocaciones en Vercel (global)

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error("❌ Falta MONGO_URI");
    return;
  }

  // Si ya está conectado, no volver a conectar
  if (isConnected) {
    return;
  }

  // Si mongoose ya tiene una conexión establecida
  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }

  try {
    mongoose.set('strictQuery', true);

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      maxPoolSize: 10,
    });

    isConnected = true;
    console.log("🚀 MongoDB conectado:", conn.connection.host);

  } catch (err) {
    console.error("❌ Error al conectar a MongoDB:", err.message);
    throw err;
  }
};

module.exports = connectDB;
