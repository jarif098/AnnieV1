const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { botName, prefix, prefixText, supportGroupText } = require('../config.json'); 

module.exports = async (bot) => {
    const startMessage = `${supportGroupText}`;

    const startCommand = async (msg) => {
        await bot.sendMessage(msg.chat.id, startMessage);
    };

    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); 
    }

    bot.onText(/\/start/i, startCommand);
    bot.onText(new RegExp(`^${escapeRegExp(prefix)}start`, 'i'), startCommand);



    bot.on('message', async (msg) => {
        if (!msg.text) return; 
        const text = msg.text.toLowerCase();

        if (text === `${botName}` || text === 'prefix') {
            await bot.sendMessage(msg.chat.id, `${prefixText}${prefix}`);
        }
    });

    bot.on('new_chat_members', async (msg) => {
        try {
            const chatId = msg.chat.id;
            const newMembers = msg.new_chat_members;
            const serverName = msg.chat.title;

            const gifUrls = [
                'https://i.giphy.com/dZXzmKGKNiJtDxuwGg.webp',
                'https://c.tenor.com/enYv1_O0jDkAAAAC/tenor.gif',
                'https://c.tenor.com/PKGBj5Vw70oAAAAC/tenor.gif',
                'https://media.tenor.com/Q7lJ9piCh2YAAAAM/youre-welcome-take-a-bow.gif',
            ];

            const randomIndex = Math.floor(Math.random() * gifUrls.length);
            const gifUrl = gifUrls[randomIndex];

            const gifPath = path.join('scripts', 'tmp', 'welcome.gif'); 
            const gifWriter = fs.createWriteStream(gifPath);
            const response = await axios({
                url: gifUrl,
                method: 'GET',
                responseType: 'stream'
            });
            response.data.pipe(gifWriter);

            gifWriter.on('finish', async () => {
                for (const member of newMembers) {
                    const firstName = member.first_name;
                    const lastName = member.last_name ? member.last_name : '';
                    const fullName = `${firstName} ${lastName}`;

                    await bot.sendDocument(
                        chatId, fs.createReadStream(gifPath),
                        {
                            caption: `Hello there, ${fullName}!\n` +
                                `Welcome to ${serverName}.\n` +
                                `You are the new member of this group.\n` +
                                `Have a great time here!`,
                            reply_to_message_id: msg.message_id
                        }
                    );

                }
            });
        } catch (error) {
            console.error("Error occurred:", error);
        }
    });

    bot.on('left_chat_member', async (msg) => {
        try {
            const chatId = msg.chat.id;
            const member = msg.left_chat_member;
            const firstName = member.first_name;
            const lastName = member.last_name ? member.last_name : '';
            const fullName = `${firstName} ${lastName}`;

            await bot.sendMessage(
                chatId,
                `Goodbye, ${fullName}.\nSee ya later.`
            );
        } catch (error) {
            console.error('Error in handling left member:', error);
        }
    });
};
