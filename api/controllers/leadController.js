const axios = require("axios");
const Lead = require("../models/Lead");
const emailjs = require("emailjs-com");
const DiscordService = require("../services/discordService");
const RecaptchaEnterpriseService = require("../services/recaptchaEnterpriseService");

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

  // Instancia del servicio reCAPTCHA Enterprise
  const recaptchaService = new RecaptchaEnterpriseService();

  try {
    // Verificar conexión a MongoDB
    const mongoose = require("mongoose");
    console.log("🔍 Estado de conexión MongoDB:", mongoose.connection.readyState);
    
    if (mongoose.connection.readyState !== 1) {
      console.error("❌ MongoDB no está conectado");
      return res.status(500).json({ message: "Base de datos no disponible" });
    }

    // Validar reCAPTCHA Enterprise (nuevo sistema)
    if (process.env.GOOGLE_CLOUD_PROJECT_ID && token) {
      console.log("🛡️ Validando reCAPTCHA Enterprise...");
      
      const recaptchaResult = await recaptchaService.validateToken(token);
      
      if (!recaptchaResult.success) {
        console.error("❌ reCAPTCHA Enterprise falló:", recaptchaResult);
        recaptchaService.close(); // Cerrar conexión
        return res.status(400).json({ 
          message: "Verificación de seguridad fallida", 
          details: recaptchaResult.message,
          score: recaptchaResult.score 
        });
      }
      
      console.log("✅ reCAPTCHA Enterprise validado exitosamente. Puntuación:", recaptchaResult.score);
      
    } else if (process.env.RECAPTCHA_SECRET_KEY && token) {
      // Fallback al sistema legacy de reCAPTCHA v2
      console.log("🔍 Validando reCAPTCHA legacy...");
      const verify = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: token,
        },
      });

      console.log("🔍 Resultado reCAPTCHA legacy:", verify.data);

      if (!verify.data.success) {
        console.error("❌ reCAPTCHA legacy falló:", verify.data);
        recaptchaService.close(); // Cerrar conexión
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

    // Enviar notificación a Discord - SIEMPRE intentar
    console.log("📢 Preparando notificación a Discord...");
    if (process.env.DISCORD_WEBHOOK_URL) {
      try {
        console.log("📢 Enviando notificación a Discord...");
        const discordService = new DiscordService(process.env.DISCORD_WEBHOOK_URL);
        await discordService.sendLeadNotification({ name, email, message });
        console.log("✅ Notificación enviada a Discord exitosamente");
      } catch (discordError) {
        console.error("⚠️ Error enviando a Discord:", discordError.message);
        console.error("Discord Error Details:", discordError);
        // No fallar si Discord falla, pero loggear claramente
      }
    } else {
      console.log("⚠️ Discord webhook no configurado - Lead creado pero sin notificación Discord");
      console.log("🔧 Para activar Discord, configura DISCORD_WEBHOOK_URL en las variables de entorno");
    }

    // Enviar correo al usuario con EmailJS
    if (email) {
      console.log("📧 Enviando correo de confirmación al usuario con EmailJS...");

      const templateParams = {
        user_name: name,
        user_email: email,
        message: `Hola ${name}, gracias por contactarnos. Hemos recibido tu mensaje y te responderemos pronto.\n\nMensaje recibido:\n${message}`,
      };

      console.log("📧 Parámetros de la plantilla de EmailJS:", templateParams);

      try {
        await emailjs.send(
          process.env.EMAILJS_SERVICE_ID, // ID del servicio configurado en EmailJS
          process.env.EMAILJS_TEMPLATE_ID, // ID de la plantilla configurada en EmailJS
          templateParams,
          process.env.EMAILJS_USER_ID // ID del usuario de EmailJS
        );

        console.log("✅ Correo enviado exitosamente a:", email);
      } catch (emailError) {
        console.error("❌ Error enviando correo con EmailJS:", emailError.message);
        console.error("Detalles del error:", emailError);
      }
    }

    res.status(201).json({ message: "Lead recibido exitosamente" });
  } catch (error) {
    console.error("❌ Error creando lead o enviando correo:", error);
    res.status(500).json({ 
      message: "Error interno del servidor",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    // Cerrar conexión del servicio reCAPTCHA Enterprise para evitar memory leaks
    recaptchaService.close();
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