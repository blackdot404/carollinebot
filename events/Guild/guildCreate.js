const Schema = require('../../Models/Welcome');

module.exports = {
    name: 'guildCreate',
    async execute(guild, client) {
        await Schema.create({
            Guild: guild.id,
            Channel: null,
            RoleChannel: null,
            Msg: null,
            Role: null,
        });

        // const guildId = client.guilds.cache.get(guild.id);
        // console.log(guildId.systemChannelId);
        // const channels = guildId.channels.cache.filter(
        //     (channel) => channel.type === 'text'
        // );
        // console.log(channels.map((channel) => channel.id));

        console.log(`Guild created successfully for ${guild.name}`);
    },
};
