module.exports = {
    config: {
        name: "uid",
        version: "1.0",
        author: "JARiF",
        category: "UTILITY",
        role: 0,
    },
    annieStart: async function({ bot, msg }) {

try {
    let mentionedUser;
    if (msg.reply_to_message) {
        mentionedUser = msg.reply_to_message.from;
    } else {
        mentionedUser = msg.from;
    }

    const entities = msg.entities || [];
    let mentionedUserID = mentionedUser.id;

    entities.forEach(entity => {
        if (entity.type === 'mention') {
            const mentionText = msg.text.substring(entity.offset, entity.offset + entity.length);
            const mentionEntity = mentionText.slice(1); 
            const mentionedUserInText = msg.entities.find(entity => entity.type === 'text_mention' && entity.user.username === mentionEntity);
            if (mentionedUserInText) {
                mentionedUserID = mentionedUserInText.user.id;
            }
        }
    });

    const userName = mentionedUser.username || mentionedUser.first_name || mentionedUser.last_name || "Unknown";

    return bot.sendMessage(msg.chat.id, `🆔 | The user ID of ${userName} is: ${mentionedUserID}`);
} catch (error) {
    console.error("Error occurred:", error);
    await bot.sendMessage(msg.chat.id, "❌ | Error occurred. Please try again later.");
}
}
};