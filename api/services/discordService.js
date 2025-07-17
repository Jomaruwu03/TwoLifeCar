const axios = require('axios');

class DiscordService {
  constructor(webhookUrl) {
    this.webhookUrl = webhookUrl;
  }

  async sendMessage(content, embeds = null) {
    if (!this.webhookUrl) {
      console.warn('Discord webhook URL not configured');
      return;
    }

    try {
      const payload = {
        content,
        embeds
      };

      await axios.post(this.webhookUrl, payload);
      console.log('Discord notification sent successfully');
    } catch (error) {
      console.error('Error sending Discord notification:', error.message);
    }
  }

  async sendLeadNotification(lead) {
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
