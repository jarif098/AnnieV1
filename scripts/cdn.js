module.exports = {
    config: {
        name: "cdn",
        version: "1.0",
        author: "JARiF",
        category: "UTILITY",
        role: 0,
    },
    annieStart: async function({ bot, msg }) {
        const chatId = msg.chat.id;
        const replyToMessage = msg.reply_to_message;

        if (!replyToMessage || !(replyToMessage.photo || replyToMessage.video || replyToMessage.audio)) {
            bot.sendMessage(chatId, "Please reply to an image, video, or audio file.");
            return;
        }

        let fileId;
        let fileType;

        if (replyToMessage.photo) {
            fileId = replyToMessage.photo[replyToMessage.photo.length - 1].file_id;
            fileType = "photo";
        } else if (replyToMessage.video) {
            fileId = replyToMessage.video.file_id;
            fileType = "video";
        } else if (replyToMessage.audio) {
            fileId = replyToMessage.audio.file_id;
            fileType = "audio";
        }

        try {
            const fileLink = await bot.getFileLink(fileId);
            bot.sendMessage(chatId, `URL of the ${fileType}: ${fileLink}`);
        } catch (error) {
            bot.sendMessage(chatId, "Failed.");
        }
    }
};
