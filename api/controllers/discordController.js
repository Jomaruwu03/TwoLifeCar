const DiscordService = require("../services/discordService");

exports.sendTestNotification = async (req, res) => {
  try {
    if (!process.env.DISCORD_WEBHOOK_URL) {
      return res.status(400).json({ 
        message: "Discord webhook URL not configured" 
      });
    }

    const discordService = new DiscordService(process.env.DISCORD_WEBHOOK_URL);
    await discordService.sendCustomNotification(
      "🧪 Prueba de Conexión",
      "¡La integración con Discord está funcionando correctamente!",
      0x00ff00 // Verde
    );

    res.json({ message: "Test notification sent to Discord" });
  } catch (error) {
    res.status(500).json({ 
      message: "Error sending Discord notification", 
      error: error.message 
    });
  }
};

exports.sendCustomMessage = async (req, res) => {
  try {
    const { title, message, color = 0x0099ff } = req.body;

    if (!title || !message) {
      return res.status(400).json({ 
        message: "Title and message are required" 
      });
    }

    if (!process.env.DISCORD_WEBHOOK_URL) {
      return res.status(400).json({ 
        message: "Discord webhook URL not configured" 
      });
    }

    const discordService = new DiscordService(process.env.DISCORD_WEBHOOK_URL);
    await discordService.sendCustomNotification(title, message, color);

    res.json({ message: "Custom notification sent to Discord" });
  } catch (error) {
    res.status(500).json({ 
      message: "Error sending Discord notification", 
      error: error.message 
    });
  }
};

exports.getDiscordStatus = async (req, res) => {
  try {
    const isConfigured = !!process.env.DISCORD_WEBHOOK_URL;
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL ? 
      `${process.env.DISCORD_WEBHOOK_URL.substring(0, 50)}...` : 
      'Not configured';
    
    res.json({
      status: "Discord service is running",
      configured: isConfigured,
      webhookUrl: webhookUrl,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(500).json({ 
      status: "Error checking Discord service",
      error: error.message 
    });
  }
};
