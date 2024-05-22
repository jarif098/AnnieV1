# ANNIEBOT V1 Documentation
## Last Updated: May 22, 2024

### ANNIEV1 Command Examples: [Explore here](https://gist.githubusercontent.com/jarif098/2f959a2d61afbc75d8aa718a69e0afc2/raw/a13e1820a5e14269bdc2c4da2e10dd49dd637e82/gistfile1.txt)

### Installation and Requirements: [Detailed guide here](https://github.com/jarif098/AnnieV1/blob/main/README.md)


### MORE INFO:

### Read this Docs to know more info about node-telegram-bot-api : [Here](https://www.npmjs.com/package/node-telegram-bot-api)

- **Getting Started:**
```javascript
// annieBot Function
annieStart: async function({ bot, msg }) {
    // Utilize the bot to send a message
    bot.sendMessage(msg.chat.id, "hey");
}
