const express = require("express");
const router = express.Router();
const discordController = require("../controllers/discordController");

// Ruta para verificar el estado de Discord
router.get("/status", discordController.getDiscordStatus);

// Ruta para probar la conexión con Discord
router.get("/test", discordController.sendTestNotification);

// Ruta para enviar mensaje personalizado a Discord
router.post("/send", discordController.sendCustomMessage);

module.exports = router;
