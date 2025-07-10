const mongoose = require("mongoose");

const connectDB = async () => {
  const connectWithRetry = async (retries = 5, delay = 5000) => {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI);
      console.log("✅ MongoDB Conectado:", conn.connection.host);
    } catch (error) {
      console.error("❌ Error conectando a MongoDB:", error.message);
      if (retries > 0) {
        console.log(`🔄 Reintentando conexión en ${delay / 1000} segundos... (${retries} intentos restantes)`);
        setTimeout(() => connectWithRetry(retries - 1, delay), delay);
      } else {
        console.error("❌ No se pudo conectar a MongoDB después de varios intentos.");
        if (process.env.NODE_ENV !== 'production') {
          process.exit(1);
        }
      }
    }
  };

  await connectWithRetry();
};

module.exports = connectDB;
