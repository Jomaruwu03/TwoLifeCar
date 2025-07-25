const http = require('http');
const querystring = require('querystring');

// Simular una verificación de reCAPTCHA v2 con token de prueba
async function testRecaptchaEndpoint() {
  console.log('🧪 Probando endpoint reCAPTCHA v2...');
  
  const postData = JSON.stringify({
    name: 'Usuario de Prueba',
    email: 'test@test.com',
    message: 'Mensaje de prueba',
    token: 'test-token-123', // Token de prueba
    acceptedTerms: true
  });

  const options = {
    hostname: 'localhost',
    port: 5001,
    path: '/api/leads',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log('📊 Status:', res.statusCode);
        console.log('📋 Response:', data);
        resolve({ status: res.statusCode, data });
      });
    });

    req.on('error', (error) => {
      console.error('❌ Error:', error.message);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

testRecaptchaEndpoint().catch(console.error);
