const axios = require('axios');

module.exports = {
  config: {
    name: "niji",
    version: "1.0",
    author: "JARiF",
    category: "AI",
    role: 0,
  },
  annieStart: async function ({ bot, chatId, msg }) {
    try {
      const text = msg.text.split(' ').slice(1).join(' ');
      if (!text) {
        return bot.sendMessage(chatId, "Please provide a prompt.");
      }

      const waitingMessage = await bot.sendMessage(chatId, "✅ | Creating your Imagination...");
      const b = 'com';
      const API = await axios.get(`https://api.vyturex.${b}/niji?text=${text}`);
      const img = API.data.imageUrl;

      await bot.sendPhoto(chatId, img, { caption: `✅ | Image Generated\nPrompt: ${text}` });
      await bot.deleteMessage(chatId, waitingMessage.message_id); 
    } catch (error) {
      console.error(error);
    }
  }
};
