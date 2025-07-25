require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

// Endpoint raíz para verificar el estado de la API
app.get("/", (req, res) => {
  res.json({
    message: "🚗 TwoLifeCar API is running",
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
      discord_status: "/api/discord/status",
      discord_test: "/api/discord/test"
    }
  });
});

app.use("/api", require("./routes/leadRoutes"));
app.use("/api/discord", require("./routes/discordRoutes"));
app.use("/api/recaptcha", require("./routes/recaptchaRoutes"));

app.listen(process.env.PORT, () => console.log(`🚀 API en http://localhost:${process.env.PORT}`));
