require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

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


// Exportar para Vercel
module.exports = app;