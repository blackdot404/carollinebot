const { EmbedBuilder, GuildMember } = require("discord.js");
const Schema = require("../../Models/Welcome");

module.exports = {
    name: "guildMemberAdd",
    async execute(member) {
        Schema.findOne({ Guild: member.guild.id }, async (err, data) => {
            if (!data) return;
            let channel = data.Channel;
            let roleChannel = data.RoleChannel;

            const { user, guild, client } = member;

            const welcomeChannel = await member.guild.channels.cache.get(
                channel
            );

            const welcomeEmbed = new EmbedBuilder()
                .setTitle(":mega: Bem vindo(a) :mega:")
                .setDescription(
                    `**${member}**, bem-vindo(a) ao servidor **${guild.name}**!
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
        });
    },
};
