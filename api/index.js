require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();


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

// Middleware global para capturar errores no manejados
app.use((err, req, res, next) => {
  console.error("❌ Error no manejado:", err.message);
  console.error("Detalles del error:", err.stack);
  res.status(500).json({
    message: "Error interno del servidor",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
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
    message: "🚗 TwoLifeCar API funcionando correctamente",
    version: "1.0.0",
    status: "healthy",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    services: {
      discord: !!process.env.DISCORD_WEBHOOK_URL ? "configured" : "not configured",
      slack: !!process.env.SLACK_WEBHOOK_URL ? "configured" : "not configured",
      mongodb: "connected",
      recaptcha: !!process.env.RECAPTCHA_SECRET_KEY ? "configured" : "not configured"
    },
    endpoints: {
      leads: "/api/leads",
      health: "/api/health",
      login: "/api/login",
      createAdmin: "/api/create-admin",
      discord_status: "/api/discord/status",
      discord_test: "/api/discord/test"
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
  const mongoose = require("mongoose");
  res.json({ 
    status: "OK",
    timestamp: new Date().toISOString(),
    mongodb: {
      connected: mongoose.connection.readyState === 1,
      state: mongoose.connection.readyState,
      host: mongoose.connection.host
    },
    environment: {
      nodeEnv: process.env.NODE_ENV,
      hasRecaptcha: !!process.env.RECAPTCHA_SECRET_KEY,
      hasSlack: !!process.env.SLACK_WEBHOOK_URL,
      hasMongoUri: !!process.env.MONGODB_URI
    }
  });
});

// Test endpoint para probar la creación de leads
app.post("/api/test-lead", async (req, res) => {
  try {
    const Lead = require("./models/Lead");
    const mongoose = require("mongoose");
    
    console.log("🧪 Test endpoint - Estado MongoDB:", mongoose.connection.readyState);
    
    const testLead = new Lead({
      name: "Test User",
      email: "test@example.com",
      message: "Este es un test",
      acceptedTerms: true
    });
    
    await testLead.save();
    
    res.json({ 
      message: "Test lead creado exitosamente",
      id: testLead._id,
      mongoState: mongoose.connection.readyState
    });
  } catch (error) {
    console.error("❌ Error en test-lead:", error);
    res.status(500).json({ 
      message: "Error en test",
      error: error.message,
      stack: error.stack
    });
  }
});

// Tus rutas existentes
app.use("/api", require("./routes/authRoutes"));
app.use("/api", require("./routes/leadRoutes"));
app.use("/api/discord", require("./routes/discordRoutes"));

// Add a route to ignore favicon requests
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Middleware para verificar la clave privada de la API
app.use((req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.PRIVATE_API_KEY) {
    console.error("❌ Clave API inválida o faltante");
    return res.status(403).json({ message: "Acceso denegado: clave API inválida" });
  }
  next();
});

// Manejo de errores 404
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada",
    path: req.originalUrl,
    availableEndpoints: [
      "GET /",
      "GET /api/health",
      "POST /api/test-lead",
      "GET /api/create-admin",
      "POST /api/login",
      "GET /api/leads",
      "POST /api/leads"
    ]
  });
});

// Verificar estado de la base de datos periódicamente
setInterval(async () => {
  const mongoose = require("mongoose");
  const dbState = mongoose.connection.readyState;

  console.log("🔍 Estado actual de MongoDB:", {
    connected: dbState === 1,
    state: dbState,
    host: mongoose.connection.host || "Desconocido"
  });

  if (dbState !== 1) {
    console.error("❌ MongoDB no está conectado. Intentando reconectar...");
    try {
      await connectDB();
      console.log("✅ Reconexión a MongoDB exitosa");
    } catch (reconnectError) {
      console.error("❌ Error al intentar reconectar a MongoDB:", reconnectError);
    }
  }
}, 60000); // Verificar cada 60 segundos

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