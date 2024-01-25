require('dotenv').config();
const sequelize = require('./config/database');
const { TOKEN_BOT } = process.env;
const {
    Client,
    GatewayIntentBits,
    Partials,
    Collection,
} = require('discord.js');

const { loadEvents } = require('./handlers/eventHandler');
const { loadCommands } = require('./handlers/commandHandler');

const { Guilds, GuildMembers, GuildMessages } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember, Channel } = Partials;

const client = new Client({
    intents: [Guilds, GuildMembers, GuildMessages],
    partials: [User, Message, GuildMember, ThreadMember, Channel],
});

client.commands = new Collection();

client.login(TOKEN_BOT).then(() => {
    loadEvents(client);
    loadCommands(client);
});

(async () => {
    await sequelize
        .sync({})
        .then(() => console.log('Connection to database was successful.'));
})();
