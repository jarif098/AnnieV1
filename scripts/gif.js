const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
    config: {
        name: "gif",
        version: "1.0",
        author: "JARiF",
        category: "FUN",
        role: 1,
    },
    annieStart: async function({ bot, msg }) {
        try {
            const chatId = msg.chat.id;
            const query = msg.text.split(' ').slice(1).join(' ');

            if (!query) {
                await bot.sendMessage(chatId, 'Please provide a prompt.');
                return;
            }

            const apiKey = 'QHv1qVaxy4LS3AmaNuUYNT9zr40ReFBI';

            await bot.sendMessage(chatId, 'Searching please wait... 🔍');

            const response = await axios.get('https://api.giphy.com/v1/gifs/search', {
                params: {
                    q: query,
                    api_key: apiKey,
                    limit: 1,
                    rating: 'b',
                },
            });

            if (response.data.data && response.data.data.length > 0) {
                const gifData = response.data.data[0];
                const gifURL = gifData.images.original.url;

                const gifPath = path.join(__dirname, 'tmp' , 'giphy.gif');
                const gifStream = fs.createWriteStream(gifPath);
                const gifResponse = await axios({
                    method: 'GET',
                    url: gifURL,
                    responseType: 'stream',
                });
                gifResponse.data.pipe(gifStream);

                gifStream.on('finish', () => {
                    bot.sendDocument(chatId, gifPath, { caption: query });
                });

            } else {
                await bot.sendMessage(chatId, 'No GIF found.');
            }
        } catch (error) {
            console.error("Error occurred:", error);
            await bot.sendMessage(chatId, 'An error occurred while processing your request.');
        }
    }
};
