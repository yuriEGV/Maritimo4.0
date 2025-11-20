const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error("❌ Falta MONGO_URI");
    return;
  }

  if (mongoose.connection.readyState >= 1) {
    // 🌟 Conexión ya lista (1 = conectado, 2 = conectando)
    return;
  }

  try {
    mongoose.set('strictQuery', true);

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    });

    console.log("✅ MongoDB conectado");

  } catch (err) {
    console.error("❌ Error al conectar a MongoDB:", err.message);
  }
};

module.exports = connectDB;
