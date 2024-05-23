module.exports = {
    config: {
        name: "pfp",
        version: "1.0",
        author: "JARiF",
        category: "FUN",
        role: 0,
    },
    annieStart: async function ({ bot, msg, match }) {
        try {
            let userId;
            let commandIssuer = msg.from.username || msg.from.id;
            let caption;

            if (!msg.reply_to_message && !match[1]) {
                userId = msg.from.id;
                caption = `👤 ${commandIssuer} requested their profile picture.`;
            } else if (msg.reply_to_message) {
                userId = msg.reply_to_message.from.id;
                let targetUsername = msg.reply_to_message.from.username || "this user";
                caption = `👤 ${commandIssuer} requested ${targetUsername}'s profile picture.`;
            } else {
                userId = parseInt(match[1], 10);
                caption = `👤 ${commandIssuer} requested the profile picture.`;
            }

            const userProfilePhotos = await bot.getUserProfilePhotos(userId);

            if (!userProfilePhotos.photos.length) {
                await bot.sendMessage(msg.chat.id, "This user doesn't have a profile photo.");
                return;
            }

            const photoFileId = userProfilePhotos.photos[0][userProfilePhotos.photos[0].length - 1].file_id;
            await bot.sendPhoto(msg.chat.id, photoFileId, { caption });

        } catch (error) {
            await bot.sendMessage(msg.chat.id, "❌ | Reply to the User's chat.");
        }
    }
};
