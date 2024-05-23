const axios = require('axios');
module.exports = {
    config: {
        name: "pi",
        version: "1.0",
        author: "JARiF",
        category: "AI",
        role: 1,
    },
    annieStart: async function({ bot, msg}) {
        try {
            const args = msg.text.split(' ').slice(1).join(' ');
            const response = await axios.get(`https://api.vyturex.com/pi?q=${encodeURIComponent(args)}`);
            await bot.sendMessage(msg.chat.id, response.data);
        } catch (error) {
            await bot.sendMessage(msg.chat.id, 'Error');
        }
    }
};

