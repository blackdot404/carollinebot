const Schema = require('../../Models/Welcome');
const { EmbedBuilder } = require('discord.js');

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

        const guildId = client.guilds.cache.get(guild.id);
        const channelGuild = guildId.channels.cache.get(
            guildId.systemChannelId
        );

        const messageEmbedded = new EmbedBuilder()
            .setColor(16312092)
            .setTitle('Oiee!! :heart: :black_heart:')
            .setDescription(
                `Olá amigos! Cheguei no servidor, ${guild.name} para ajudar a vocês.`
            )
            .addFields(
                { name: 'Regular field title', value: 'Some value here' },
                { name: '\u200B', value: '\u200B' },
                {
                    name: 'Inline field title',
                    value: 'Some value here',
                    inline: true,
                },
                {
                    name: 'Inline field title',
                    value: 'Some value here',
                    inline: true,
                }
            )
            .setThumbnail(client.user.displayAvatarURL())
            .setTimestamp()
            .setFooter({
                text: client.user.username,
                iconURL: client.user.displayAvatarURL(),
            });

        channelGuild.send({ embeds: [messageEmbedded] });

        console.log(`Guild created successfully for ${guild.name}`);
    },
};
