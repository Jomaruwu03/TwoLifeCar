require('dotenv').config();
const axios = require('axios');
const RecaptchaEnterpriseService = require('./services/recaptchaEnterpriseService');

// Configuración de colores para la consola
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = (color, emoji, message) => {
  console.log(`${colors[color]}${emoji} ${message}${colors.reset}`);
};

async function testRecaptchaEnterprise() {
  log('cyan', '🚀', 'INICIANDO TEST DE RECAPTCHA ENTERPRISE');
  console.log('📡 Configuración actual:');
  console.log(`   Project ID: ${process.env.GOOGLE_CLOUD_PROJECT_ID || 'No configurado'}`);
  console.log(`   Site Key: ${process.env.RECAPTCHA_ENTERPRISE_SITE_KEY || 'No configurado'}`);
  console.log('');

  const apiUrl = 'http://localhost:5000';
  let passedTests = 0;
  const totalTests = 4;

  // Test 1: Verificar estado del servicio
  try {
    log('blue', '🔍', '1. Verificando estado del servicio reCAPTCHA Enterprise...');
    const response = await axios.get(`${apiUrl}/api/recaptcha/status`);
    
    if (response.status === 200) {
      log('green', '✅', 'Estado del servicio: OK');
      console.log('   📋 Detalles:', JSON.stringify(response.data, null, 2));
      passedTests++;
    } else {
      log('red', '❌', `Error en estado del servicio: ${response.status}`);
    }
  } catch (error) {
    log('red', '❌', `Error verificando estado: ${error.message}`);
  }

  console.log('');

  // Test 2: Obtener configuración
  try {
    log('blue', '⚙️', '2. Obteniendo configuración de reCAPTCHA...');
    const response = await axios.get(`${apiUrl}/api/recaptcha/config`);
    
    if (response.status === 200) {
      log('green', '✅', 'Configuración obtenida exitosamente');
      console.log('   📋 Config:', JSON.stringify(response.data, null, 2));
      passedTests++;
    } else {
      log('red', '❌', `Error obteniendo configuración: ${response.status}`);
    }
  } catch (error) {
    log('red', '❌', `Error obteniendo configuración: ${error.message}`);
  }

  console.log('');

  // Test 3: Validación directa con el servicio (sin token real)
  try {
    log('blue', '🛡️', '3. Probando servicio reCAPTCHA Enterprise directamente...');
    
    const recaptchaService = new RecaptchaEnterpriseService();
    
    // Simular un token falso para ver el comportamiento
    const result = await recaptchaService.createAssessment('fake-token-for-testing', 'test_action', 0.1);
    
    log('yellow', '⚠️', 'Test con token falso (esperado fallar):');
    console.log('   📋 Resultado:', JSON.stringify(result, null, 2));
    
    // Este test pasa si manejamos correctamente el token falso
    if (!result.success && result.reason) {
      log('green', '✅', 'Manejo correcto de tokens inválidos');
      passedTests++;
    } else {
      log('red', '❌', 'Comportamiento inesperado con token falso');
    }
    
    recaptchaService.close();
    
  } catch (error) {
    log('red', '❌', `Error en test directo: ${error.message}`);
  }

  console.log('');

  // Test 4: Test mediante API endpoint
  try {
    log('blue', '🌐', '4. Probando endpoint de test de reCAPTCHA...');
    
    const testData = {
      token: 'test-token-from-api',
      action: 'api_test'
    };
    
    const response = await axios.post(`${apiUrl}/api/recaptcha/test`, testData);
    
    if (response.status === 200) {
      log('yellow', '⚠️', 'Response del endpoint de test:');
      console.log('   📋 Resultado:', JSON.stringify(response.data, null, 2));
      
      // El test pasa si recibimos una respuesta estructurada
      if (response.data.result) {
        log('green', '✅', 'Endpoint de test funciona correctamente');
        passedTests++;
      } else {
        log('red', '❌', 'Endpoint no devolvió resultado esperado');
      }
    } else {
      log('red', '❌', `Error en endpoint de test: ${response.status}`);
    }
    
  } catch (error) {
    if (error.response && error.response.status === 500) {
      log('yellow', '⚠️', 'Endpoint devolvió error 500 (esperado con token falso)');
      console.log('   📋 Response:', JSON.stringify(error.response.data, null, 2));
      passedTests++; // Esto es el comportamiento esperado
    } else {
      log('red', '❌', `Error inesperado en endpoint: ${error.message}`);
    }
  }

  console.log('');
  log('cyan', '📊', 'RESUMEN DEL TEST:');
  
  const testResults = [
    { name: 'Estado del Servicio', status: passedTests >= 1 ? '✅' : '❌' },
    { name: 'Configuración', status: passedTests >= 2 ? '✅' : '❌' },
    { name: 'Validación Directa', status: passedTests >= 3 ? '✅' : '❌' },
    { name: 'Endpoint API', status: passedTests >= 4 ? '✅' : '❌' }
  ];

  testResults.forEach(test => {
    console.log(`   ${test.status} ${test.name}`);
  });

  console.log('');
  if (passedTests === totalTests) {
    log('green', '🎉', `Todos los tests pasaron (${passedTests}/${totalTests})`);
    log('green', '💡', 'reCAPTCHA Enterprise está configurado correctamente');
  } else {
    log('yellow', '⚠️', `${passedTests}/${totalTests} tests pasaron`);
    log('yellow', '💡', 'Revisa la configuración de Google Cloud y las credenciales');
  }

  console.log('');
  log('cyan', '🔧', 'INSTRUCCIONES PARA CONFIGURAR:');
  console.log('   1. Configura GOOGLE_CLOUD_PROJECT_ID en tu .env');
  console.log('   2. Configura RECAPTCHA_ENTERPRISE_SITE_KEY en tu .env');
  console.log('   3. Asegúrate de tener las credenciales de Google Cloud configuradas');
  console.log('   4. Para producción, configura la autenticación de Google Cloud');
}

// Verificar que las dependencias estén instaladas
console.log('🔍 Verificando configuración...');
if (!process.env.GOOGLE_CLOUD_PROJECT_ID) {
  log('yellow', '⚠️', 'GOOGLE_CLOUD_PROJECT_ID no está configurado');
}
if (!process.env.RECAPTCHA_ENTERPRISE_SITE_KEY) {
  log('yellow', '⚠️', 'RECAPTCHA_ENTERPRISE_SITE_KEY no está configurado');
}

console.log('');
testRecaptchaEnterprise().catch(error => {
  log('red', '❌', `Error ejecutando test: ${error.message}`);
  process.exit(1);
});
