const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

module.exports = {
    config: {
        name: "sh",
        version: "1.0",
        author: "JARiF",
        category: "UTILITY",
        role: 1,
    },
    annieStart: async function({ bot, msg, match }) {

if (!match || !match[1]) {
    await bot.sendMessage(msg.chat.id, 'Please provide a command.');
    return;
}

const args = msg.text.split(' ').slice(1).join(' ');

if (!args) {
    await bot.sendMessage(msg.chat.id, 'Invalid args provided.');
    return;
}

try {
    const timeout = 30000;
    const childProcess = exec(args, { timeout }, (error, stdout, stderr) => {
        if (error) {
            bot.sendMessage(msg.chat.id, `Process Error: ${error.stack || error.message}`);
            return;
        }

        if (stderr) {
            bot.sendMessage(msg.chat.id, `STDERR:\n${stderr}`);
            return;
        }

        if (stdout.length > 10000) {
            const filename = path.join(__dirname, 'shell_output.txt');
            fs.writeFileSync(filename, stdout);
            bot.sendMessage(msg.chat.id, 'Output too long, sent as file:', {
                reply_to_message_id: msg.message_id,
                document: fs.createReadStream(filename)
            });
        } else {
            bot.sendMessage(msg.chat.id, `STDOUT:\n${stdout}`);
        }
    });

    childProcess.on('error', (error) => {
        bot.sendMessage(msg.chat.id, `Unexpected error: ${error.stack || error.message}`);
        console.error(error);
    });

} catch (error) {
    bot.sendMessage(msg.chat.id, `Unexpected error: ${error.stack || error.message}`);
    console.error(error);
}
}
};