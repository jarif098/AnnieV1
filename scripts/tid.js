module.exports = {
    config: {
        name: "tid",
        version: "1.0",
        author: "JARiF",
        category: "UTILITY",
        role: 0,
    },
    annieStart: async function({ bot, chatId, msg }) {
      try {
          await bot.sendMessage(msg.chat.id, `Group Name: ${msg.chat.title}\nThreadID: ${msg.chat.id}`);
      } catch (error) {
          console.error("Error occurred:", error);
          await bot.sendMessage(msg.chat.id, "Sorry.");
      }
  }
}

