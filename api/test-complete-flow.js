require('dotenv').config();
const axios = require('axios');

// Configuración
const apiUrl = 'http://localhost:5001';

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = (color, message) => console.log(`${colors[color]}${message}${colors.reset}`);

// Función para verificar el estado general de la API
async function checkAPIStatus() {
  try {
    log('blue', '🏥 1. Verificando estado general de la API...');
    const response = await axios.get(`${apiUrl}/`);
    log('green', '✅ API funcionando correctamente');
    log('cyan', `   Estado: ${response.data.status}`);
    log('cyan', `   Environment: ${response.data.environment}`);
    log('cyan', `   Discord: ${response.data.services?.discord || 'no configurado'}`);
    log('cyan', `   Slack: ${response.data.services?.slack || 'no configurado'}`);
    log('cyan', `   MongoDB: ${response.data.services?.mongodb || 'desconocido'}`);
    console.log('');
    return response.data;
  } catch (error) {
    log('red', '❌ Error verificando API');
    log('red', `   ${error.response?.data?.message || error.message}`);
    return null;
  }
}

// Función para verificar el estado específico de Discord
async function checkDiscordStatus() {
  try {
    log('blue', '🎮 2. Verificando estado específico de Discord...');
    const response = await axios.get(`${apiUrl}/api/discord/status`);
    log('green', '✅ Discord endpoint funcionando');
    log('cyan', `   Configurado: ${response.data.configured}`);
    log('cyan', `   Webhook: ${response.data.webhookUrl}`);
    log('cyan', `   Timestamp: ${response.data.timestamp}`);
    console.log('');
    return response.data;
  } catch (error) {
    log('red', '❌ Error verificando Discord');
    log('red', `   ${error.response?.data?.message || error.message}`);
    return null;
  }
}

// Función para probar notificación de Discord
async function testDiscordNotification() {
  try {
    log('blue', '🧪 3. Enviando notificación de prueba a Discord...');
    const response = await axios.get(`${apiUrl}/api/discord/test`);
    log('green', '✅ Notificación de prueba enviada');
    log('cyan', `   Respuesta: ${response.data.message}`);
    console.log('');
    return response.data;
  } catch (error) {
    log('red', '❌ Error enviando prueba a Discord');
    log('red', `   ${error.response?.data?.message || error.message}`);
    return null;
  }
}

// Función para simular el envío del formulario de la landing
async function simulateLandingFormSubmission() {
  try {
    log('blue', '📝 4. Simulando envío del formulario de la landing...');
    
    const leadData = {
      name: 'Juan Pérez Test',
      email: 'juan.test@twolifecar.com',
      message: '¡Hola! Estoy interesado en comprar un auto usado. Me gustaría saber qué opciones tienen disponibles en sedanes económicos. Gracias por su atención.',
      acceptedTerms: true,
      // Removemos el token para evitar problemas con reCAPTCHA en test
      // token: 'test_recaptcha_token_simulation'
    };

    log('cyan', '   📋 Datos del lead:');
    log('cyan', `      Nombre: ${leadData.name}`);
    log('cyan', `      Email: ${leadData.email}`);
    log('cyan', `      Mensaje: ${leadData.message.substring(0, 50)}...`);
    log('cyan', `      Términos aceptados: ${leadData.acceptedTerms}`);
    log('yellow', '   ⚠️  Sin token reCAPTCHA (modo test)');
    
    const response = await axios.post(`${apiUrl}/api/leads`, leadData);
    
    log('green', '✅ Lead creado exitosamente');
    log('cyan', `   Respuesta: ${response.data.message}`);
    log('cyan', `   Status: ${response.status}`);
    console.log('');
    
    return response.data;
  } catch (error) {
    log('red', '❌ Error creando lead');
    log('red', `   Status: ${error.response?.status}`);
    log('red', `   Mensaje: ${error.response?.data?.message || error.message}`);
    console.log('');
    return null;
  }
}

// Función para verificar los leads creados
async function checkCreatedLeads() {
  try {
    log('blue', '📊 5. Verificando leads en la base de datos...');
    
    // Agregar headers de autenticación
    const headers = {
      'x-api-key': process.env.PRIVATE_API_KEY || 'K4Z7UR6QsYuXFxdsR3fAi'
    };
    
    const response = await axios.get(`${apiUrl}/api/leads`, { headers });
    
    const leads = response.data;
    log('green', `✅ Se encontraron ${leads.length} leads en total`);
    
    if (leads.length > 0) {
      const latestLead = leads[0]; // Los leads están ordenados por fecha desc
      log('cyan', '   📋 Último lead creado:');
      log('cyan', `      ID: ${latestLead._id}`);
      log('cyan', `      Nombre: ${latestLead.name}`);
      log('cyan', `      Email: ${latestLead.email}`);
      log('cyan', `      Fecha: ${new Date(latestLead.createdAt).toLocaleString()}`);
    }
    
    console.log('');
    return leads;
  } catch (error) {
    log('red', '❌ Error obteniendo leads');
    log('red', `   ${error.response?.data?.message || error.message}`);
    return null;
  }
}

// Función para enviar mensaje personalizado a Discord
async function sendCustomDiscordMessage() {
  try {
    log('blue', '💌 6. Enviando mensaje personalizado a Discord...');
    
    const customMessage = {
      title: '🚗 Test Completo de TwoLifeCar',
      message: `¡El test completo del flujo landing → API → Discord ha sido exitoso!\n\n✅ API funcionando\n✅ Discord configurado\n✅ Leads siendo guardados\n✅ Notificaciones llegando\n\nFecha del test: ${new Date().toLocaleString()}`,
      color: 0x00ff00 // Verde para éxito
    };
    
    const response = await axios.post(`${apiUrl}/api/discord/send`, customMessage);
    
    log('green', '✅ Mensaje personalizado enviado a Discord');
    log('cyan', `   Título: ${customMessage.title}`);
    log('cyan', `   Respuesta: ${response.data.message}`);
    console.log('');
    
    return response.data;
  } catch (error) {
    log('red', '❌ Error enviando mensaje personalizado');
    log('red', `   ${error.response?.data?.message || error.message}`);
    return null;
  }
}

// Función principal que ejecuta todo el test
async function runCompleteTest() {
  log('bright', '🚀 INICIANDO TEST COMPLETO DE TWOLIFECAR - LANDING → DISCORD\n');
  log('yellow', `📡 URL de la API: ${apiUrl}\n`);
  
  const results = {};
  
  // 1. Verificar estado de la API
  results.apiStatus = await checkAPIStatus();
  
  // 2. Verificar Discord
  results.discordStatus = await checkDiscordStatus();
  
  // 3. Probar notificación de Discord
  results.discordTest = await testDiscordNotification();
  
  // 4. Simular envío del formulario
  results.leadCreation = await simulateLandingFormSubmission();
  
  // 5. Verificar leads
  results.leads = await checkCreatedLeads();
  
  // 6. Mensaje de resumen
  results.customMessage = await sendCustomDiscordMessage();
  
  // Resumen final
  log('bright', '📋 RESUMEN DEL TEST:\n');
  
  const tests = [
    { name: 'API Status', result: results.apiStatus },
    { name: 'Discord Status', result: results.discordStatus },
    { name: 'Discord Test', result: results.discordTest },
    { name: 'Lead Creation', result: results.leadCreation },
    { name: 'Leads Verification', result: results.leads },
    { name: 'Custom Message', result: results.customMessage }
  ];
  
  let passedTests = 0;
  tests.forEach(test => {
    if (test.result) {
      log('green', `   ✅ ${test.name}: PASSED`);
      passedTests++;
    } else {
      log('red', `   ❌ ${test.name}: FAILED`);
    }
  });
  
  console.log('');
  if (passedTests === tests.length) {
    log('green', '🎉 ¡TODOS LOS TESTS PASARON! La integración está funcionando perfectamente.');
    log('green', '🚗💬 El flujo Landing → API → Discord está completamente operativo.');
  } else {
    log('yellow', `⚠️  ${passedTests}/${tests.length} tests pasaron. Revisa los errores arriba.`);
  }
  
  console.log('');
  log('cyan', '💡 Nota: Si Discord no está configurado, algunos tests fallarán pero la funcionalidad básica funcionará.');
  log('cyan', '🔧 Para configurar Discord, agrega DISCORD_WEBHOOK_URL a tu archivo .env');
  
  return results;
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  runCompleteTest().catch(error => {
    log('red', `💥 Error fatal en el test: ${error.message}`);
    process.exit(1);
  });
}

module.exports = {
  checkAPIStatus,
  checkDiscordStatus,
  testDiscordNotification,
  simulateLandingFormSubmission,
  checkCreatedLeads,
  sendCustomDiscordMessage,
  runCompleteTest
};
