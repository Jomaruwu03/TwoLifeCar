const axios = require('axios');

// Simulación de prueba del endpoint con reCAPTCHA
async function testRecaptcha() {
  try {
    console.log('🧪 Probando endpoint sin token reCAPTCHA...');
    
    const response = await axios.post('http://localhost:5001/api/leads', {
      name: 'Test User',
      email: 'test@example.com',
      message: 'Mensaje de prueba',
      acceptedTerms: true
      // Sin token para ver si falla apropiadamente
    });
    
    console.log('✅ Respuesta:', response.data);
  } catch (error) {
    console.log('⚠️ Error esperado (sin reCAPTCHA):', error.response?.data || error.message);
  }
  
  console.log('\n📋 Configuración actual:');
  console.log('- Frontend: http://localhost:5173/');
  console.log('- Backend: http://localhost:5001/');
  console.log('- reCAPTCHA v2 Site Key: 6Ld2UHorAAAAAEauS5-9aLll9XVNfDvm4-G-NgRI');
  console.log('- reCAPTCHA v2 Secret Key: 6Ld2UHorAAAAADNHVYtCuUM5Z6bSzni_MdSQmcse');
}

testRecaptcha();
