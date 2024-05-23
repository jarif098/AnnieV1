const axios = require('axios');
const { shorten } = require('tinyurl');

module.exports = {
  config: {
    name: "prompt",
    version: "1.0",
    author: "Eijah Noah",
    role: 0,
    category: "AI"
  },
 annieStart: async function ({ bot, msg, chatId }) {
    try {
      const khankirChele = msg.text.split(' ').slice(1).join(' ');
      let imageUrl;

      const replyToMessage = msg.reply_to_message;
      if (replyToMessage && replyToMessage.photo && replyToMessage.photo.length > 0) {
        const img = replyToMessage.photo[replyToMessage.photo.length - 1].file_id;
        const fileLink = await bot.getFileLink(img);
        const shortUrl = await shorten(fileLink);
        imageUrl = shortUrl;
      } else if (!khankirChele) {
        return bot.sendMessage(chatId, "❌ | Reply to an image or provide a prompt.");
      }

      if (imageUrl) {
        const response = await axios.get(`https://www.api.vyturex.com/describe?url=${imageUrl}`);
        const description = response.data;
        await bot.sendMessage(chatId, description);
      } else if (khankirChele) {
        const response = await axios.get(`https://www.api.vyturex.com/promptgen?content=${encodeURIComponent(khankirChele)}`);
        const prompt = response.data;
        await bot.sendMessage(chatId, prompt );
      }
    } catch (error) {
      bot.sendMessage(chatId, error.message);
    }
  }
};
