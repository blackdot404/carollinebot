require('dotenv').config();
const fs = require('fs');
const { TOKEN_BOT } = process.env;
const { Client, Collection, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: GatewayIntentBits.Guilds
});
client.commands = new Collection();
client.buttons = new Collection();
client.commandArray = [];

const functionFolders = fs.readdirSync(`./src/functions`);
for (const folder of functionFolders) {
    const functionFiles = fs.readdirSync(`./src/functions/${folder}`).filter((file) => file.endsWith('.js'));
    for (const file of functionFiles) {
        require(`./functions/${folder}/${file}`)(client);
    }
}

client.handleEvents();
client.handleCommands();
client.login(TOKEN_BOT);