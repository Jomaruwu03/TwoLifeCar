const express = require("express");
const router = express.Router();
const { createLead, getLeads, deleteLead, testRecaptcha, testDiscord } = require("../controllers/leadController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.post("/leads", createLead);
router.get("/leads", verifyToken, getLeads);
router.delete("/leads/:id", verifyToken, deleteLead);
router.get("/test-recaptcha", testRecaptcha); // Endpoint de prueba sin autenticación
router.get("/test-discord", testDiscord); // Endpoint de prueba para Discord
router.post("/leads/reply", async (req, res) => {
  const { email, subject, message } = req.body;

  if (!email || !subject || !message) {
    return res.status(400).json({ message: "Email, asunto y mensaje son requeridos" });
  }

  try {
    const emailjs = require("emailjs-com");

    const templateParams = {
      user_email: email,
      subject,
      message,
    };

    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      templateParams,
      process.env.EMAILJS_USER_ID
    );

    res.status(200).json({ message: "Respuesta enviada exitosamente" });
  } catch (error) {
    console.error("Error enviando respuesta:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

module.exports = router;
