const axios = require('axios');

// Test completo de creación de lead
async function testLeadCreation() {
  try {
    console.log('🧪 Testing lead creation with Discord notification...');
    
    const leadData = {
      name: 'Usuario de Prueba Complete',
      email: 'test-complete@example.com',
      message: 'Mensaje de prueba para verificar toda la funcionalidad',
      acceptedTerms: true,
      recaptchaResponse: 'test-token' // Esto debería activar el modo bypass
    };

    console.log('📤 Enviando lead...');
    const response = await axios.post('http://localhost:5001/api/leads', leadData);
    
    console.log('✅ Lead created successfully');
    console.log('📋 Response:', response.data);
    
  } catch (error) {
    console.error('❌ Error creating lead:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data?.message);
    console.error('Full error:', error.response?.data);
  }
}

testLeadCreation();
