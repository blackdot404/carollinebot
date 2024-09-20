require('dotenv').config();
const {
    Client,
    Collection,
    GatewayIntentBits,
    Partials,
} = require('discord.js');
const fs = require('fs');
const sequelize = require('./database/connection');

const {
    Guilds,
    GuildMembers,
    GuildMessages,
    GuildMessageTyping,
    GuildMessageReactions,
    DirectMessageReactions,
    GuildWebhooks,
    GuildIntegrations,
    GuildEmojisAndStickers,
} = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember, Channel, Reaction } =
    Partials;

const client = new Client({
    intents: [
        Guilds,
        GuildMembers,
        GuildMessages,
        GuildMessageTyping,
        GuildMessageReactions,
        DirectMessageReactions,
        GuildWebhooks,
        GuildIntegrations,
        GuildEmojisAndStickers,
    ],
    partials: [User, Message, GuildMember, ThreadMember, Channel, Reaction],
});

client.commands = new Collection();
client.buttons = new Collection();
client.commandArray = [];

const functionFolders = fs.readdirSync('./src/functions');
for (const folder of functionFolders) {
    const functionFiles = fs
        .readdirSync(`./src/functions/${folder}`)
        .filter((file) => file.endsWith('.js'));

    for (const file of functionFiles) {
        require(`./functions/${folder}/${file}`)(client);
    }
}

client.handleEvents();
client.handleCommands();
client.handleComponents();
client.login(process.env.BOT_TOKEN);
(async () => {
    await sequelize
        .sync({})
        .then(() =>
            console.log('[DATABASE]: Conexão com o banco de dados efetuada.'),
        )
        .catch((error) => console.log(`[DATABASE] Error: ${error}`));
})();
