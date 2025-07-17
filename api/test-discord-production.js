// Script para verificar Discord en producción
const axios = require('axios');

// URL base de tu API en Vercel
const API_URL = process.env.API_URL || 'https://tu-api.vercel.app';

async function checkDiscordStatus() {
  try {
    console.log('🔍 Verificando estado de Discord...');
    const response = await axios.get(`${API_URL}/api/discord/status`);
    console.log('✅ Estado de Discord:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error verificando Discord:', error.response?.data || error.message);
    return null;
  }
}

async function testDiscordNotification() {
  try {
    console.log('🧪 Enviando notificación de prueba...');
    const response = await axios.get(`${API_URL}/api/discord/test`);
    console.log('✅ Prueba enviada:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error en prueba:', error.response?.data || error.message);
    return null;
  }
}

async function checkAPIHealth() {
  try {
    console.log('🏥 Verificando salud de la API...');
    const response = await axios.get(`${API_URL}/`);
    console.log('✅ API Status:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error en API:', error.response?.data || error.message);
    return null;
  }
}

async function simulateLeadCreation() {
  try {
    console.log('👤 Simulando creación de lead...');
    const response = await axios.post(`${API_URL}/api/leads`, {
      name: 'Test Usuario',
      email: 'test@twolifecar.com',
      message: 'Este es un mensaje de prueba desde el script de verificación',
      acceptedTerms: true,
      token: 'test_token_simulation' // En producción necesitarías un token real
    });
    console.log('✅ Lead creado:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error creando lead:', error.response?.data || error.message);
    return null;
  }
}

async function runProductionTest() {
  console.log('🚀 Iniciando verificación de Discord en producción\n');
  console.log(`📡 API URL: ${API_URL}\n`);
  
  // 1. Verificar salud general de la API
  await checkAPIHealth();
  console.log('');
  
  // 2. Verificar estado específico de Discord
  await checkDiscordStatus();
  console.log('');
  
  // 3. Probar notificación de Discord
  await testDiscordNotification();
  console.log('');
  
  // 4. Simular creación de lead (comentado por seguridad)
  // await simulateLeadCreation();
  
  console.log('🏁 Verificación completada');
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  runProductionTest();
}

module.exports = {
  checkDiscordStatus,
  testDiscordNotification,
  checkAPIHealth,
  simulateLeadCreation
};
