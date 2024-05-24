const fs = require("fs-extra");
const axios = require("axios");
const ytdl = require("@neoxr/ytdl-core");
const yts = require("yt-search");
const { shorten } = require('tinyurl');

module.exports = {
    config: {
        name: "video",
        version: "1.0",
        author: "JARiF",
        category: "MEDIA",
        role: 0,
    },
    annieStart: async function({ bot, msg, match }) {
        try {
            let songName;
            const replyToMessage = msg.reply_to_message;

            if (replyToMessage && (replyToMessage.audio || replyToMessage.video)) {
                let attachmentUrl;
                if (replyToMessage.audio) {
                    attachmentUrl = await bot.getFileLink(replyToMessage.audio.file_id);
                } else {
                    attachmentUrl = await bot.getFileLink(replyToMessage.video.file_id);
                }
                const shortUrl = await shorten(attachmentUrl);
                const response = await axios.get(`https://www.api.vyturex.com/songr?url=${shortUrl}`);
                songName = response.data.title;

                if (!songName) {
                    await bot.sendMessage(msg.chat.id, "Error: Failed to get song name from the provided file.");
                    return;
                }
            } else {
                songName = msg.text.split(' ').slice(1).join(' ');
                if (!songName) {
                    await bot.sendMessage(msg.chat.id, "❌ Please provide a name or keywords to search, or reply to an audio or video file.");
                    return;
                }
            }

            const chatId = msg.chat.id;
            const searchingMessage = await bot.sendMessage(chatId, `⏳ | Searching Music "${songName}"`);

            const searchResults = await yts(songName);
            if (!searchResults.videos.length) {
                await bot.sendMessage(chatId, "Error: No search results found.");
                await bot.deleteMessage(chatId, searchingMessage.message_id);
                return;
            }

            const video = searchResults.videos[0];
            const videoUrl = video.url;

            const stream = ytdl(videoUrl, { filter: "videoandaudio" });
            const fileName = `${video.title}.mp4`;
            const filePath = `./scripts/tmp/${fileName}`;

            const writeStream = fs.createWriteStream(filePath);
            stream.pipe(writeStream);

            writeStream.on('finish', async () => {
                console.info('[DOWNLOADER] Downloaded');

                if (fs.statSync(filePath).size > 26214400) {
                    fs.unlinkSync(filePath);
                    await bot.sendMessage(chatId, '[ERR] The file could not be sent because it is larger than 25MB.');
                } else {
                    const caption = `Title: ${video.title}\nArtist: ${video.author.name}`;
                    const audio = fs.createReadStream(filePath);

                    await bot.sendAudio(chatId, audio, { caption });
                }

                writeStream.close();

                await bot.deleteMessage(chatId, searchingMessage.message_id);
            });

            writeStream.on('error', async (error) => {
                console.error('[WRITE STREAM ERROR]', error);
                await bot.sendMessage(chatId, '[ERR] Failed to write audio file.');
                await bot.deleteMessage(chatId, searchingMessage.message_id);
            });

        } catch (error) {
            console.error('[ERROR]', error);
            await bot.sendMessage(msg.chat.id, 'Error');
        }
    }
}

