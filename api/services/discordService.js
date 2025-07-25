const axios = require('axios');

class DiscordService {
  constructor(webhookUrl) {
    this.webhookUrl = webhookUrl;
  }

  async sendMessage(content, embeds = null) {
    if (!this.webhookUrl) {
      console.warn('⚠️ Discord webhook URL not configured');
      return;
    }

    try {
      console.log('🔍 Enviando mensaje a Discord...');
      console.log('🔍 Webhook URL (primeros 50 chars):', this.webhookUrl.substring(0, 50) + "...");
      console.log('🔍 Content:', content || 'Sin contenido');
      console.log('🔍 Embeds:', embeds ? `${embeds.length} embed(s)` : 'Sin embeds');

      const payload = {
        content,
        embeds
      };

      console.log('🔍 Payload completo:', JSON.stringify(payload, null, 2));

      const response = await axios.post(this.webhookUrl, payload);
      console.log('✅ Discord notification sent successfully');
      console.log('✅ Response status:', response.status);
      
    } catch (error) {
      console.error('❌ Error sending Discord notification:', error.message);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      console.error('❌ Error stack:', error.stack);
      throw error; // Re-lanzar para que el controlador lo capture
    }
  }

  async sendLeadNotification(lead) {
    console.log('🔍 Preparando embed para Discord...');
    console.log('🔍 Lead data:', { name: lead.name, email: lead.email, messageLength: lead.message?.length });

    const embed = {
      title: "🚗 Nuevo Lead de TwoLifeCar",
      color: 0x00ff00, // Color verde
      fields: [
        {
          name: "👤 Nombre",
          value: lead.name,
          inline: true
        },
        {
          name: "📧 Email",
          value: lead.email,
          inline: true
        },
        {
          name: "💬 Mensaje",
          value: lead.message || "Sin mensaje",
          inline: false
        }
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: "TwoLifeCar CRM"
      }
    };

    console.log('🔍 Embed creado:', JSON.stringify(embed, null, 2));
    
    await this.sendMessage("", [embed]);
  }

  async sendCustomNotification(title, description, color = 0x0099ff) {
    const embed = {
      title,
      description,
      color,
      timestamp: new Date().toISOString(),
      footer: {
        text: "TwoLifeCar CRM"
      }
    };

    await this.sendMessage("", [embed]);
  }
}

module.exports = DiscordService;
