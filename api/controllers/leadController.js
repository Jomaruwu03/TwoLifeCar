const axios = require("axios");
const Lead = require("../models/Lead");

exports.createLead = async (req, res) => {
  const { name, email, message, token, acceptedTerms } = req.body;

  if (!token) return res.status(400).json({ message: "reCAPTCHA token missing" });
  
  if (!acceptedTerms) {
    return res.status(400).json({ message: "Debe aceptar los términos y condiciones" });
  }

  try {
    // Validar reCAPTCHA
    const verify = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
      params: {
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: token,
      },
    });

    if (!verify.data.success) return res.status(400).json({ message: "reCAPTCHA failed" });

    const newLead = new Lead({ name, email, message, acceptedTerms });
    await newLead.save();

    await axios.post(process.env.SLACK_WEBHOOK_URL, {
      text: `🚗 Nuevo lead de TwoLifeCar:\n*Nombre:* ${name}\n*Email:* ${email}\n*Mensaje:* ${message}`,
    });

    res.status(201).json({ message: "Lead recibido" });
  } catch (error) {
    console.error("Error creating lead:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

exports.getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    console.error("Error getting leads:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

exports.deleteLead = async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ message: "Lead archivado" });
  } catch (error) {
    console.error("Error deleting lead:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

exports.replyLead = async (req, res) => {
  try {
    const { email } = req.body;
    res.json({ message: `Responder a: ${email}` });
  } catch (error) {
    console.error("Error replying lead:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};