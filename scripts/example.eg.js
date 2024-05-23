module.exports = {
    config: {
        name: "example", //commandName
        version: "1.0", //version
        author: "JARiF", //author of the command
        category: "UTILITY", //category
        role: 1, // Role required to execute the command .. role = 1 for only admins & role = 0 for everyone
    },

    //for reply or button 
    annieReply: async function(bot){
        //code
    },

    // Function for annieBot
    annieStart: async function({ bot, msg }) {
        // Send a message using the bot
        bot.sendMessage(msg.chat.id, "hey");
    }
};
