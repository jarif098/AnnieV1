const axios = require('axios');

module.exports = {
    config: {
        name: "insta",
        version: "1.0",
        author: "JARiF",
        category: "MEDIA",
        role: 0,
    },
    annieStart: async function({ bot, msg}) {

try {
            const link = msg.text.split(' ').slice(1).join(' ');

            if (!link) {
                return bot.sendMessage(msg.chat.id, `Please provide the link to the Instagram video.`);
            }

            const BASE_URL = `https://api-turtle.vercel.app/api/insta?url=${encodeURIComponent(link)}`;
          const g =   await bot.sendMessage(msg.chat.id, "⬇ | Downloading the video for you");

            const res = await axios.get(BASE_URL);
            const videoUrl = res.data.url;

            await bot.sendVideo(msg.chat.id, videoUrl);
            await bot.deleteMessage(g.chat.id, g.message_id);

        } catch (error) {
            console.error("Error occurred:", error);
            await bot.sendMessage(msg.chat.id, "Sorry, the Instagram video could not be downloaded.");
        }
    }
}