const Schema = require('../../models/GuildUser');

module.exports = {
    name: 'guildDelete',
    async execute(guild) {
        await Schema.deleteOne({ Guild: guild.id });

        console.log(`Guild deleted successfully for ${guild.name}`);
    },
};
