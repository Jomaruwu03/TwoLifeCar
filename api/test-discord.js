const axios = require('axios');

// Configuración
const API_BASE_URL = 'http://localhost:5000';

// Función para probar la conexión con Discord
async function testDiscordConnection() {
  try {
    console.log('🧪 Probando conexión con Discord...');
    const response = await axios.get(`${API_BASE_URL}/api/discord/test`);
    console.log('✅ Prueba exitosa:', response.data.message);
  } catch (error) {
    console.error('❌ Error en la prueba:', error.response?.data?.message || error.message);
  }
}

// Función para enviar un mensaje personalizado
async function sendCustomMessage(title, message, color = 0x0099ff) {
  try {
    console.log('📤 Enviando mensaje personalizado...');
    const response = await axios.post(`${API_BASE_URL}/api/discord/send`, {
      title,
      message,
      color
    });
    console.log('✅ Mensaje enviado:', response.data.message);
  } catch (error) {
    console.error('❌ Error enviando mensaje:', error.response?.data?.message || error.message);
  }
}

// Función para simular un nuevo lead
async function simulateLead() {
  try {
    console.log('👤 Simulando nuevo lead...');
    const response = await axios.post(`${API_BASE_URL}/api/leads`, {
      name: 'Juan Pérez',
      email: 'juan.perez@email.com',
      message: 'Estoy interesado en comprar un auto usado',
      token: 'test_token_for_simulation' // En producción esto vendría del reCAPTCHA
    });
    console.log('✅ Lead creado:', response.data.message);
  } catch (error) {
    console.error('❌ Error creando lead:', error.response?.data?.message || error.message);
  }
}

// Ejecutar pruebas
async function runTests() {
  console.log('🚀 Iniciando pruebas de Discord para TwoLifeCar\n');
  
  // Esperar un momento para que el servidor esté listo
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  await testDiscordConnection();
  console.log('');
  
  await sendCustomMessage(
    '🎉 Bienvenido a TwoLifeCar', 
    'La integración con Discord está funcionando perfectamente!',
    0x00ff00 // Verde
  );
  console.log('');
  
  await sendCustomMessage(
    '⚠️ Notificación de Sistema', 
    'Este es un ejemplo de notificación de advertencia',
    0xff9900 // Naranja
  );
  console.log('');
  
  // Comentamos la simulación de lead porque requiere reCAPTCHA real
  // await simulateLead();
  
  console.log('🏁 Pruebas completadas');
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  runTests();
}

module.exports = {
  testDiscordConnection,
  sendCustomMessage,
  simulateLead
};
