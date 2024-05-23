const axios = require('axios');
const fs = require('fs');

let tracksData = [];

module.exports = {
    config: {
        name: "ytb",
        version: "1.0",
        author: "Rehat | JARiF",
        category: "MEDIA",
        role: 0,
    },
    annieReply: function (bot) {
        bot.on('callback_query', async (callbackQuery) => {
            const chatId = callbackQuery.message.chat.id;
            const userId = callbackQuery.from.id; 
            const data = JSON.parse(callbackQuery.data);

            if (data.action === 'select_track') {
                const { index } = data;
                const selectedTrack = tracksData[index];

                if (!selectedTrack || !selectedTrack.url) {
                    return console.log("The selected track is invalid or missing a URL.");
                }

                const downloadingMessage = await bot.sendMessage(chatId, `⬇️ | Downloading the video for you,  <a href="tg://user?id=${userId}">${callbackQuery.from.first_name}</a>`, { parse_mode: 'HTML' });

                try {
                    const apiResponse = await axios.get(`https://rehatdesu.xyz/api/youtube/download?url=${encodeURIComponent(selectedTrack.url)}`);

                    if (apiResponse.data && apiResponse.data.url) {
                        const { url } = apiResponse.data;
                        const res = await axios.get(url, { responseType: 'stream' });
                        const videoStream = fs.createWriteStream('ytb.mp4');
                        res.data.pipe(videoStream);

                        await new Promise((resolve, reject) => {
                            videoStream.on('finish', resolve);
                            videoStream.on('error', reject);
                        });


                        
                    await bot.deleteMessage(chatId, callbackQuery.message.message_id);
                    await bot.deleteMessage(chatId, downloadingMessage.message_id);
                    
                        await bot.sendVideo(chatId, fs.createReadStream('ytb.mp4'));
                        fs.unlinkSync('ytb.mp4');
                    } else {
                        throw new Error("No download URL provided by the API.");
                    }

                } catch (error) {
                    console.error(error);
                    bot.sendMessage(chatId, "An error occurred while downloading the video.");
                }
            }
        });
    },
    annieStart: async function ({ bot, msg }) {
        const chatId = msg.chat.id;
        const query = msg.text.split(' ').slice(1).join(' ');

        if (!query) {
            return bot.sendMessage(chatId, "Please enter a track name!");
        }

        const SearchapiUrl = `https://rehatdesu.xyz/api/youtube/search?query=${encodeURIComponent(query)}`;
        try {
            const response = await axios.get(SearchapiUrl);
            tracksData = response.data.slice(0, 6);

            if (tracksData.length === 0) {
                return bot.sendMessage(chatId, "No videos found for the given query.");
            }

            const buttons = tracksData.map((track, index) => ({
                text: `${index + 1}. ${track.title}`,
                callback_data: JSON.stringify({ action: 'select_track', index })
            }));

            await bot.sendMessage(chatId, "Select a video:", {
                reply_markup: {
                    inline_keyboard: buttons.map(button => [button])
                }
            });
        } catch (error) {
            console.error(error);
            bot.sendMessage(chatId, "An error occurred while searching for videos.");
        }
    }
};
