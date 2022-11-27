const {
    Client,
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
} = require("discord.js");
const ms = require("ms");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("mute")
        .setDescription("Silencia um membro do servidor.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption((option) =>
            option
                .setName("usuario")
                .setDescription("Selecione o usuario que será silenciado.")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("tempo")
                .setDescription(
                    "Tempo que o usuario será silenciado. (h = horas, m = minutos, s = segundos)"
                )
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("motivo")
                .setDescription(
                    "Por qual motivo que o usuario será silenciado?"
                )
                .setRequired(false)
        ),

    async execute(interaction) {
        const { guild, options } = interaction;

        const user = options.getUser("usuario");
        const member = guild.members.cache.get(user.id);
        const time = options.getString("tempo");
        const convertedTime = ms(time);
        const reason =
            options.getString("motivo") || "Sem motivo em especifico.";

        const errEmbed = new EmbedBuilder()
            .setDescription(
                "Ops... Não foi possivel atender sua solicitação! Tente depois😓."
            )
            .setColor(16312092);

        const sucessEmbed = new EmbedBuilder()
            .setTitle("**:white_check_mark: Silenciado!**")
            .setDescription(`Usuario ${user} silenciado com sucesso.`)
            .addFields(
                { name: "Motivo", value: `${reason}`, inline: true },
                { name: "Tempo", value: `${time}`, inline: true }
            )
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

        if (!convertedTime)
            return interaction.reply({ embeds: [errEmbed], ephemeral: true });

        try {
            await member.timeout(convertedTime, reason);

            interaction.reply({ embeds: [sucessEmbed], ephemeral: true });
        } catch (err) {
            console.log(err);
        }
    },
};
