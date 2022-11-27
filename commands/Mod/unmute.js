const {
    Client,
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unmute")
        .setDescription("Comando para tirar o 'Desmutar' um usuario. ")
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption((option) =>
            option
                .setName("usuario")
                .setDescription("Seleciona o usuario que será 'Desmutado'")
                .setRequired(true)
        ),
    async execute(interaction) {
        const { guild, options } = interaction;

        const user = options.getUser("usuario");
        const member = guild.members.cache.get(user.id);

        const errEmbed = new EmbedBuilder()
            .setDescription(
                "Ops... Não foi possivel atender sua solicitação! Tente depois😓."
            )
            .setColor(16312092);

        const sucessEmbed = new EmbedBuilder()
            .setTitle("**:white_check_mark: Desmutado!**")
            .setDescription(`Usuario ${user} foi desmutado com sucesso.`)
            .setColor(16312092)
            .setTimestamp();

        if (
            member.roles.highest.position >=
            interaction.member.roles.highest.position
        )
            return interaction.reply({ embeds: [errEmbed], ephemeral: true }); //tentativa de silenciar um cargo maior que do bot.

        if (
            !interaction.guild.members.me.permissions.has(
                PermissionFlagsBits.ModerateMembers
            )
        )
            return interaction.reply({ embeds: [errEmbed], ephemeral: true });

        try {
            await member.timeout(null);

            interaction.reply({ embeds: [sucessEmbed], ephemeral: true });
        } catch (err) {
            console.log(err);
        }
    },
};
