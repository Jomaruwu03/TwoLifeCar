require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Configurar CORS
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://twolifecar-landing.vercel.app',
        'https://twolifecar-dashboard.vercel.app',
        'https://twolifecar-api-psi.vercel.app'
      ]
    : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3001'],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.use(express.json());

// Middleware para manejar preflight requests
app.options('*', cors(corsOptions));

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Error interno del servidor" });
});

// Conectar a MongoDB (sin bloquear la aplicación)
connectDB().catch(console.error);

// Crear usuario admin por defecto si no existe
const createDefaultAdmin = async () => {
  try {
    const User = require("./models/User");
    const existingAdmin = await User.findOne({ username: "admin" });
    
    if (!existingAdmin) {
      const adminUser = new User({
        username: "admin",
        password: "123456" // Será hasheado automáticamente por el pre-save hook
      });
      await adminUser.save();
      console.log("✅ Usuario admin creado automáticamente");
      console.log("📋 Credenciales: admin / 123456");
    } else {
      console.log("✅ Usuario admin ya existe");
    }
  } catch (error) {
    console.error("❌ Error creando usuario admin:", error);
  }
};

// Crear admin después de conectar a la DB
setTimeout(createDefaultAdmin, 2000);

// Ruta principal
app.get("/", (req, res) => {
  res.json({ 
    message: "TwoLifeCar API funcionando correctamente",
    version: "1.0.0",
    endpoints: {
      leads: "/api/leads",
      health: "/api/health",
      login: "/api/login",
      createAdmin: "/api/create-admin"
    },
    adminCredentials: {
      username: "admin",
      password: "123456",
      note: "Usuario admin se crea automáticamente al iniciar"
    }
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK",
    timestamp: new Date().toISOString(),
    database: "Connected" // Puedes agregar estado de DB aquí
  });
});

// Tus rutas existentes
app.use("/api", require("./routes/authRoutes"));
app.use("/api", require("./routes/leadRoutes"));

// Manejo de errores 404
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada",
    path: req.originalUrl,
    availableEndpoints: [
      "GET /",
      "GET /api/health",
      "GET /api/create-admin",
      "POST /api/login",
      "GET /api/leads",
      "POST /api/leads"
    ]
  });
});

// Configurar el puerto
const PORT = process.env.PORT || 5000;

// Solo iniciar el servidor si no estamos en Vercel y no está siendo importado
if (!process.env.VERCEL && require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
  });
}

// Exportar para Vercel
module.exports = app;