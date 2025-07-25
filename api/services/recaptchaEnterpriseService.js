const { RecaptchaEnterpriseServiceClient } = require('@google-cloud/recaptcha-enterprise');

class RecaptchaEnterpriseService {
  constructor() {
    this.client = new RecaptchaEnterpriseServiceClient();
    this.projectID = process.env.GOOGLE_CLOUD_PROJECT_ID || "localhost-1750903724401";
    this.recaptchaKey = process.env.RECAPTCHA_ENTERPRISE_SITE_KEY || "6LeKw44rAAAAAEeD0TOL0M_zAA7_hiujVT0ltfKu";
  }

  /**
   * Crea una evaluación para analizar el riesgo de una acción de la IU.
   *
   * @param {string} token - El token generado obtenido del cliente.
   * @param {string} recaptchaAction - El nombre de la acción que corresponde al token.
   * @param {number} minScore - Puntuación mínima aceptable (por defecto 0.5)
   * @returns {Object} - Resultado de la evaluación
   */
  async createAssessment(token, recaptchaAction = "submit_lead", minScore = 0.5) {
    try {
      const projectPath = this.client.projectPath(this.projectID);

      // Crea la solicitud de evaluación
      const request = {
        assessment: {
          event: {
            token: token,
            siteKey: this.recaptchaKey,
          },
        },
        parent: projectPath,
      };

      const [response] = await this.client.createAssessment(request);

      // Verifica si el token es válido
      if (!response.tokenProperties.valid) {
        console.log(`❌ reCAPTCHA token inválido: ${response.tokenProperties.invalidReason}`);
        return {
          success: false,
          score: 0,
          reason: response.tokenProperties.invalidReason,
          message: "Token de reCAPTCHA inválido"
        };
      }

      // Verifica si se ejecutó la acción esperada
      if (response.tokenProperties.action !== recaptchaAction) {
        console.log(`❌ Acción de reCAPTCHA no coincide. Esperada: ${recaptchaAction}, Recibida: ${response.tokenProperties.action}`);
        return {
          success: false,
          score: response.riskAnalysis.score,
          reason: "action_mismatch",
          message: "La acción del reCAPTCHA no coincide con la esperada"
        };
      }

      const score = response.riskAnalysis.score;
      console.log(`🛡️ Puntuación de reCAPTCHA: ${score}`);

      // Log de razones de riesgo si existen
      if (response.riskAnalysis.reasons.length > 0) {
        console.log("⚠️ Razones de riesgo detectadas:");
        response.riskAnalysis.reasons.forEach((reason) => {
          console.log(`   - ${reason}`);
        });
      }

      // Determina si la puntuación es aceptable
      const isValid = score >= minScore;

      return {
        success: isValid,
        score: score,
        reasons: response.riskAnalysis.reasons,
        message: isValid 
          ? "reCAPTCHA válido" 
          : `Puntuación de riesgo demasiado baja: ${score} (mínimo: ${minScore})`,
        details: {
          action: response.tokenProperties.action,
          hostname: response.tokenProperties.hostname,
          androidPackageName: response.tokenProperties.androidPackageName
        }
      };

    } catch (error) {
      console.error("❌ Error en reCAPTCHA Enterprise:", error);
      return {
        success: false,
        score: 0,
        reason: "service_error",
        message: "Error interno del servicio de reCAPTCHA",
        error: error.message
      };
    }
  }

  /**
   * Valida un token de reCAPTCHA con configuración simplificada
   * @param {string} token - Token de reCAPTCHA del cliente
   * @returns {Object} - Resultado simplificado de la validación
   */
  async validateToken(token) {
    if (!token) {
      return {
        success: false,
        message: "Token de reCAPTCHA requerido"
      };
    }

    const result = await this.createAssessment(token, "submit_lead", 0.5);
    
    return {
      success: result.success,
      score: result.score,
      message: result.message
    };
  }

  /**
   * Cierra la conexión del cliente (importante para evitar memory leaks)
   */
  close() {
    if (this.client) {
      this.client.close();
    }
  }
}

module.exports = RecaptchaEnterpriseService;
