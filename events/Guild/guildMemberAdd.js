const { EmbedBuilder } = require('discord.js');
const Schema = require('../../Models/GuildUser');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        const data = await Schema.findOne({ Guild: member.guild.id });
        if (!data) return;
        let channel = data.Channel;
        let roleChannel = data.RoleChannel;
        let msgWelcome = data.Msg;

        const { user, guild, client } = member;

        const welcomeChannel = await member.guild.channels.cache.get(channel);

        const welcomeEmbed = new EmbedBuilder()
            .setTitle(':mega: Bem vindo(a) :mega:')
            .setDescription(
                `**${member}**, bem-vindo(a) ao servidor **${guild.name}**!
                \n**${msgWelcome}**
                \nAtualmente estamos com **${guild.memberCount} membros**.
                \nNão esqueça de ler as <#${roleChannel}>
                \n`
            )
            .setColor(16312092)
            .setFooter({
                text: client.user.username,
                iconURL: client.user.displayAvatarURL(),
            })
            .setTimestamp()
            .setThumbnail(user.displayAvatarURL());

        welcomeChannel.send({ embeds: [welcomeEmbed] });
    },
};
