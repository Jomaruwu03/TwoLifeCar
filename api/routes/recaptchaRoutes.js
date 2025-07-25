const express = require("express");
const router = express.Router();
const recaptchaController = require("../controllers/recaptchaController");

// Ruta para verificar el estado del servicio reCAPTCHA Enterprise
router.get("/status", recaptchaController.getRecaptchaStatus);

// Ruta para probar la validación de reCAPTCHA Enterprise
router.post("/test", recaptchaController.testRecaptchaValidation);

// Ruta para obtener la configuración del frontend
router.get("/config", recaptchaController.getRecaptchaConfig);

module.exports = router;
