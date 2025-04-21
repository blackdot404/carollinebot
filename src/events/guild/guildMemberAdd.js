const { EmbedBuilder } = require('discord.js');
const userGuild = require('../../models/userGuild');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        /*
            'user' representa o usuario acessando a servidor discord
            'guild' representa o servidor discord
            'client' representa o bot discord
        */

        const data = await userGuild.findOne({
            where: { Guild: member.guild.id },
        });
        if (!data) return;
        if (member.user.bot) return;
        const channel = data.Channel;
        const roleChannel = data.RoleChannel;
        // const recruitChannel = data.RecruitChannel;

        // const recruitChannel = data.RecruitChannel;
        const classChannel = data.ClassChannel;

        const { user, guild } = member;

        const welcomeChannel = await guild.channels.cache.get(channel);

        const welcomeEmbed = new EmbedBuilder()
            .setTitle(':mega: Bem vindo(a) :mega:')
            .setDescription(
                `**${member}**, bem-vindo(a) ao servidor **${guild.name}**!
                \nLeia as regras para liberar o recrutamento
                \nAtualmente estamos com **${guild.memberCount} membros**.
                \nVeja também :point_down:
                \n`,
            )
            .addFields(
                {
                    name: ':scroll:Leia as Regras:',
                    value: `<#${roleChannel}>`,
                    inline: true,
                },
                {
                    name: ':military_medal:Adquire as tags:',
                    value: `<#${classChannel}>`,
                    inline: true,
                },
            )
            .setColor(0x0099ff)
            .setFooter({
                text: `user: ${user.tag} | id: ${user.id}`,
                iconURL: user.displayAvatarURL(),
            })
            .setTimestamp()
            .setThumbnail(user.displayAvatarURL());

        welcomeChannel.send({ embeds: [welcomeEmbed] });
    },
};
