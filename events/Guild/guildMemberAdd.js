// const { EmbedBuilder } = require("@discordjs/builders");
const { EmbedBuilder, GuildMember } = require("discord.js");

module.exports = {
    name: "guildMemberAdd",
    async execute(member) {
        const { user, guild, client } = member;
        const welcomeChannel = await member.guild.channels.cache.get(
            "824700294360989737"
        );
        const welcomeRoles = "824702840562778142";

        const welcomeEmbed = new EmbedBuilder()
            .setTitle(":mega: Bem vindo(a) :mega:")
            .setDescription(
                `**${member}**, bem-vindo(a) ao servidor **${guild.name}**!
                \nAtualmente estamos com **${guild.memberCount} membros**.
                \nNão esqueça de ler as <#${welcomeRoles}>
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
