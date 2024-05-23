const config = require('../config.json');
const adminIds = config.adminUids;

module.exports = {
    config: {
        name: "callad",
        version: "1.0",
        author: "JARiF",
        category: "UTILITY",
        role: 0,
    },
    annieStart: async function({ bot, msg, chatId }) {
        const message = msg.text.split(' ').slice(1).join(' ');

        const userName = msg.from.username || 'Unknown';
        const userId = msg.from.id;
        const groupName = msg.chat.title || 'From Inbox';
        const threadId = msg.chat.id;

        const adminMessage = ` ==📨 CALL ADMIN 📨==\n- User Name: ${userName}\n- User ID: ${userId}\n- Sent from group: ${groupName}\n- Thread ID: ${threadId}\nContent:\n ─────────────────\n${message}\n─────────────────`;

        await Promise.all(adminIds.map(adminId => {
            return bot.sendMessage(adminId, adminMessage, { parse_mode: 'HTML' })
                .then(() => {
                    bot.sendMessage(chatId, 'Your message has been sent to the admins.');
                })
                .catch((err) => {
                    console.error('Error sending message to admin:', err);
                    bot.sendMessage(chatId, 'Failed to send message to admins. Please try again later.');
                });
        }));
    }
}
