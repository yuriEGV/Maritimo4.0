/*const mongoose = require('mongoose');

const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/school-system';
    try {
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB connected: ${mongoUri}`);
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
        process.exit(1);
    }
};

module.exports = connectDB;*/



/*const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/school-system';
  try {
    await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB conectado correctamente`);
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;*/

// connectDB.js
/*const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/school-system';

  try {
    // Configuración opcional recomendada
    mongoose.set('strictQuery', true);

    const options = {
      // Los siguientes valores ayudan a evitar timeouts de red o desconexiones prolongadas
      connectTimeoutMS: 10000,  // Tiempo límite para conexión: 10 segundos
      socketTimeoutMS: 45000,   // Cierra conexiones inactivas después de 45 segundos
      maxPoolSize: 10,          // Controla el tamaño del pool de conexiones
      retryWrites: true,        // Reintenta escrituras en caso de errores transitorios
      w: 'majority'             // Nivel de confirmación de escritura
    };

    await mongoose.connect(mongoUri, options);

    console.log('✅ MongoDB conectado correctamente');
    console.log(`📡 Base de datos: ${mongoose.connection.name}`);
    console.log(`🌐 Servidor: ${mongoose.connection.host}:${mongoose.connection.port}`);
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error.message);
    process.exit(1);
  }
};

// Escucha eventos útiles para depuración
mongoose.connection.on('error', err => {
  console.error(`⚠️ Error en la conexión MongoDB: ${err.message}`);
});
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ Conexión MongoDB perdida. Intentando reconectar...');
});

module.exports = connectDB;*/

const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  // <-- Este reemplazo hace que SOLO use variable de entorno (sin fallback local)
  if (!mongoUri) {
    throw new Error('❌ Falta la variable de entorno MONGO_URI. Configúrala en Vercel!');
  }

  try {
    mongoose.set('strictQuery', true);

    const options = {
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority'
    };

    await mongoose.connect(mongoUri, options);

    console.log('✅ MongoDB conectado correctamente');
    console.log(`📡 Base de datos: ${mongoose.connection.name}`);
    console.log(`🌐 Servidor: ${mongoose.connection.host}:${mongoose.connection.port}`);
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error.message);
    process.exit(1);
  }
};

// Escucha eventos útiles para depuración
mongoose.connection.on('error', err => {
  console.error(`⚠️ Error en la conexión MongoDB: ${err.message}`);
});
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ Conexión MongoDB perdida. Intentando reconectar...');
});

module.exports = connectDB;

