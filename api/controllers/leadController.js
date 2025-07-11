const axios = require("axios");
const Lead = require("../models/Lead");
const nodemailer = require("nodemailer");

exports.createLead = async (req, res) => {
  const { name, email, message, token, acceptedTerms } = req.body;

  console.log("📨 Datos recibidos:", { name, email, message, token: token ? "✅" : "❌", acceptedTerms });

  // Validar campos requeridos
  if (!name || !email || !message) {
    console.error("❌ Validación fallida: campos requeridos faltantes");
    return res.status(400).json({ message: "Nombre, email y mensaje son requeridos" });
  }

  if (!acceptedTerms) {
    console.error("❌ Validación fallida: términos no aceptados");
    return res.status(400).json({ message: "Debe aceptar los términos y condiciones" });
  }

  try {
    // Verificar conexión a MongoDB
    const mongoose = require("mongoose");
    console.log("🔍 Estado de conexión MongoDB:", mongoose.connection.readyState);
    
    if (mongoose.connection.readyState !== 1) {
      console.error("❌ MongoDB no está conectado");
      return res.status(500).json({ message: "Base de datos no disponible" });
    }

    // Validar reCAPTCHA solo si está configurado
    if (process.env.RECAPTCHA_SECRET_KEY && token) {
      console.log("🔍 Validando reCAPTCHA...");
      const verify = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: token,
        },
      });

      console.log("🔍 Resultado reCAPTCHA:", verify.data);

      if (!verify.data.success) {
        console.error("❌ reCAPTCHA falló:", verify.data);
        return res.status(400).json({ message: "reCAPTCHA failed" });
      }
    } else {
      console.log("⚠️ reCAPTCHA no configurado o token faltante");
    }

    console.log("💾 Guardando lead en MongoDB...");
    const newLead = new Lead({ name, email, message, acceptedTerms });
    
    console.log("🔍 Lead creado en memoria:", newLead);
    
    await newLead.save();
    console.log("✅ Lead guardado exitosamente con ID:", newLead._id);

    // Enviar notificación a Slack solo si está configurado
    if (process.env.SLACK_WEBHOOK_URL) {
      try {
        console.log("📢 Enviando notificación a Slack...");
        await axios.post(process.env.SLACK_WEBHOOK_URL, {
          text: `🚗 Nuevo lead de TwoLifeCar:\n*Nombre:* ${name}\n*Email:* ${email}\n*Mensaje:* ${message}`,
        });
        console.log("✅ Notificación enviada a Slack");
      } catch (slackError) {
        console.error("⚠️ Error enviando a Slack:", slackError.message);
        // No fallar si Slack falla
      }
    } else {
      console.log("⚠️ Slack webhook no configurado");
    }

    // Enviar correo al usuario
    if (email) {
      console.log("📧 Enviando correo de confirmación al usuario...");

      const transporter = nodemailer.createTransport({
        service: "gmail", // Cambiar según el proveedor de correo
        auth: {
          user: process.env.EMAIL_USER, // Configurar en .env
          pass: process.env.EMAIL_PASS, // Configurar en .env
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Gracias por tu interés en TwoLifeCar",
        text: `Hola ${name},

Gracias por contactarnos. Hemos recibido tu mensaje y te responderemos pronto.

Mensaje recibido:
${message}

Saludos,
El equipo de TwoLifeCar`,
      };

      await transporter.sendMail(mailOptions);
      console.log("✅ Correo enviado exitosamente a:", email);
    }

    res.status(201).json({ message: "Lead recibido exitosamente" });
  } catch (error) {
    console.error("❌ Error creando lead o enviando correo:", error);
    res.status(500).json({ 
      message: "Error interno del servidor",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
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