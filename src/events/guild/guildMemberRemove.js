const { EmbedBuilder } = require('discord.js');
const UserGuildSettings = require('../../models/UserGuildSettings');

module.exports = {
    name: 'guildMemberRemove',
    async execute(member) {
        const data = await UserGuildSettings.findOne({
            attributes: ['Guild', 'LogChannel'],
            where: { Guild: member.guild.id },
        });
        if (!data) return;
        if (member.user.bot) return;

        const { user, guild } = member;

        const leaveChannel = await guild.channels.cache.get(data.LogChannel);

        if (!leaveChannel) return;

        const leaveEmbed = new EmbedBuilder()
            .setDescription(`:mega: O ${user.username} saiu da guilda...`)
            .setColor(0xff001a)
            .setTimestamp();

        leaveChannel.send({ embeds: [leaveEmbed] });
    },
};
