const RecaptchaEnterpriseService = require("../services/recaptchaEnterpriseService");

/**
 * Controlador para verificar el estado del servicio reCAPTCHA Enterprise
 */
exports.getRecaptchaStatus = async (req, res) => {
  try {
    const status = {
      service: "reCAPTCHA Enterprise",
      configured: {
        projectId: !!process.env.GOOGLE_CLOUD_PROJECT_ID,
        siteKey: !!process.env.RECAPTCHA_ENTERPRISE_SITE_KEY,
      },
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || "No configurado",
      siteKey: process.env.RECAPTCHA_ENTERPRISE_SITE_KEY ? 
        process.env.RECAPTCHA_ENTERPRISE_SITE_KEY.substring(0, 10) + "..." : 
        "No configurado",
      status: "✅ Disponible"
    };

    res.json(status);
  } catch (error) {
    console.error("❌ Error verificando estado de reCAPTCHA Enterprise:", error);
    res.status(500).json({
      service: "reCAPTCHA Enterprise",
      status: "❌ Error",
      error: error.message
    });
  }
};

/**
 * Endpoint para probar la validación de reCAPTCHA Enterprise
 */
exports.testRecaptchaValidation = async (req, res) => {
  const { token, action = "test_action" } = req.body;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Token de reCAPTCHA requerido"
    });
  }

  const recaptchaService = new RecaptchaEnterpriseService();

  try {
    console.log("🧪 Probando validación de reCAPTCHA Enterprise...");
    
    const result = await recaptchaService.createAssessment(token, action, 0.3); // Umbral bajo para testing
    
    res.json({
      success: true,
      message: "Test de reCAPTCHA Enterprise completado",
      result: result
    });

  } catch (error) {
    console.error("❌ Error en test de reCAPTCHA Enterprise:", error);
    res.status(500).json({
      success: false,
      message: "Error interno en test de reCAPTCHA",
      error: error.message
    });
  } finally {
    recaptchaService.close();
  }
};

/**
 * Endpoint para obtener información de configuración del frontend
 */
exports.getRecaptchaConfig = async (req, res) => {
  try {
    const config = {
      siteKey: process.env.RECAPTCHA_ENTERPRISE_SITE_KEY,
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      // Para compatibilidad con el sistema legacy
      legacySiteKey: process.env.RECAPTCHA_SITE_KEY,
      hasEnterprise: !!process.env.GOOGLE_CLOUD_PROJECT_ID,
      hasLegacy: !!process.env.RECAPTCHA_SECRET_KEY
    };

    res.json(config);
  } catch (error) {
    console.error("❌ Error obteniendo configuración de reCAPTCHA:", error);
    res.status(500).json({
      error: "Error obteniendo configuración"
    });
  }
};
