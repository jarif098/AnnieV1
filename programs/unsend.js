module.exports = function(bot) {
    bot.onText(new RegExp(`^${require('../config.json').prefix}${module.exports.help.name}(?:\\s+(.+)|\\s*)$`), async (msg, match) => {
        if (msg.reply_to_message) {
            const messageIDToDelete = msg.reply_to_message.message_id;
            bot.deleteMessage(msg.chat.id, messageIDToDelete);
        }
    });
};
module.exports.help = {
    name: "unsend",
    author: "JARiF",
    info: {
        description: "Delete a message by replying to it with !unsend",
        version: "1.0",
        role: "0 (All users)"
    },
    category: "UTILITY",
    usage: "!unsend"
};