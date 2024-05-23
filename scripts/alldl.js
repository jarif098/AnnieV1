const axios = require('axios');

module.exports = {
    config: {
        name: "alldl",
        version: "1.0",
        author: "JARiF",
        category: "MEDIA",
        role: 0,
    },
    annieStart: async function({ bot, msg }) {
        try {
            const link = msg.text.split(' ').slice(1).join(' ');

            if (!link) {
                return bot.sendMessage(msg.chat.id, `Please provide the link to the video.`);
            }

            const BASE_URL = `https://noobs-api2.onrender.com/dipto/alldl?url=${link}`;
            const g = await bot.sendMessage(msg.chat.id, "⬇ | Downloading the video for you");

            const res = await axios.get(BASE_URL);
            const videoUrl = res.data.result;

            if (videoUrl) {
                await bot.sendVideo(msg.chat.id, videoUrl);
                await bot.deleteMessage(g.chat.id, g.message_id);
            } else {
                throw new Error("No video URL found in the response.");
            }

        } catch (error) {
            console.error("Error occurred:", error);
            await bot.sendMessage(msg.chat.id, "Sorry, the video could not be downloaded.");
        }
    }
}
