const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Conectado:", conn.connection.host);
  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error.message);
    // En Vercel, no queremos que la app se cierre
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
