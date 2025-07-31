const DiscordService = require('./api/services/discordService');

async function testDiscord() {
  console.log('🧪 Probando Discord Service...');
  
  const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1398373802194505758/gEfST5Ztk36NLXiaKIlEolNn2Se0EHgsp2myr5N4WtSLdQg7Sh7jiC-7QS8WlwbFnGcp';
  
  console.log('🔍 DISCORD_WEBHOOK_URL configurado:', !!DISCORD_WEBHOOK_URL);

  const discordService = new DiscordService(DISCORD_WEBHOOK_URL);

  try {
    console.log('📤 Enviando mensaje de prueba...');
    await discordService.sendLeadNotification({
      name: 'Usuario de Prueba',
      email: 'test@example.com',
      message: 'Este es un mensaje de prueba para verificar que Discord funciona correctamente.'
    });
    console.log('✅ Test completado exitosamente');
  } catch (error) {
    console.error('❌ Error en el test:', error.message);
    console.error('❌ Stack:', error.stack);
  }
}

testDiscord();
