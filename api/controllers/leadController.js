const axios = require("axios");
const Lead = require("../models/Lead");

exports.createLead = async (req, res) => {
  const { name, email, message, token } = req.body;

  if (!token) return res.status(400).json({ message: "reCAPTCHA token missing" });

  // Validar reCAPTCHA
  const verify = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
    params: {
      secret: process.env.RECAPTCHA_SECRET_KEY,
      response: token,
    },
  });

  if (!verify.data.success) return res.status(400).json({ message: "reCAPTCHA failed" });

  const newLead = new Lead({ name, email, message });
  await newLead.save();

  await axios.post(process.env.SLACK_WEBHOOK_URL, {
    text: `🚗 Nuevo lead de TwoLifeCar:\n*Nombre:* ${name}\n*Email:* ${email}\n*Mensaje:* ${message}`,
  });

  res.status(201).json({ message: "Lead recibido" });
};

exports.getLeads = async (req, res) => {
  const leads = await Lead.find().sort({ createdAt: -1 });
  res.json(leads);

exports.deleteLead = async (req, res) => {
  await Lead.findByIdAndDelete(req.params.id);
  res.json({ message: "Lead archivado" });
}
};

exports.replyLead = async (req, res) => {
  const { email } = req.body;
  res.json({ message: `Responder a: ${email}` });

};
