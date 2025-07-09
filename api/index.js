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
        'https://twolifecar-dashboard.vercel.app'
      ]
    : ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Error interno del servidor" });
});

// Conectar a MongoDB (sin bloquear la aplicación)
connectDB().catch(console.error);

// Ruta principal
app.get("/", (req, res) => {
  res.json({ 
    message: "TwoLifeCar API funcionando correctamente",
    version: "1.0.0",
    endpoints: {
      leads: "/api/leads",
      health: "/api/health"
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
      "GET /api",
      "GET /api/health",
      "GET /api/leads" // Ajusta según tus rutas
    ]
  });
});

// Configurar el puerto
const PORT = process.env.PORT || 5000;

// Solo iniciar el servidor si no estamos en Vercel
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
  });
}

// Exportar para Vercel
module.exports = app;