require('dotenv').config();
const RecaptchaEnterpriseService = require("./services/recaptchaEnterpriseService");

async function testRecaptcha() {
  console.log("🧪 TEST SIMPLE DE RECAPTCHA ENTERPRISE");
  console.log("=====================================");
  
  // Verificar configuración
  console.log("📋 Configuración:");
  console.log(`   Project ID: ${process.env.GOOGLE_CLOUD_PROJECT_ID}`);
  console.log(`   Site Key: ${process.env.RECAPTCHA_ENTERPRISE_SITE_KEY}`);
  console.log(`   Secret Key: ${process.env.RECAPTCHA_ENTERPRISE_SECRET_KEY ? 'Configurado ✅' : 'No configurado ❌'}`);
  console.log(`   Credenciales: ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`);
  
  // Instanciar servicio
  const recaptchaService = new RecaptchaEnterpriseService();
  
  try {
    console.log("\n🛡️ Prueba 1: Token inválido (debe fallar)");
    const result1 = await recaptchaService.validateToken("token_falso_12345");
    console.log("   Resultado:", result1);
    
    console.log("\n🛡️ Prueba 2: Token vacío (debe fallar)");
    const result2 = await recaptchaService.validateToken("");
    console.log("   Resultado:", result2);
    
    console.log("\n🛡️ Prueba 3: Sin token (debe fallar)");
    const result3 = await recaptchaService.validateToken(null);
    console.log("   Resultado:", result3);
    
  } catch (error) {
    console.error("❌ Error en test:", error.message);
  } finally {
    recaptchaService.close();
  }
  
  console.log("\n✅ Test completado");
}

testRecaptcha();
