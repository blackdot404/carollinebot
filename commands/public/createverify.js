const {
    EmbedBuilder,
    ButtonStyle,
    ActionRowBuilder,
    ButtonBuilder,
    SlashCommandBuilder,
    CommandInteraction,
    PermissionFlagsBits,
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("createverify")
        .setDescription("Seta seu canal de verificação de membros.")
        .addChannelOption((option) =>
            option
                .setName("channel")
                .setDescription("Envia um texto para o canal.")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const channel = interaction.options.getChannel("canal");
        const verifyEmbed = new EmbedBuilder()
            .setTitle(":name_badge: Regras do Servidor :name_badge:")
            .setDescription(
                "Clique no botão se você concorda com as regras apresentadas acima."
            )
            .setColor(16312092);
        let sendChannel = channel.send({
            embeds: [verifyEmbed],
            components: [
                new ActionRowBuilder().setComponents(
                    new ButtonBuilder()
                        .setCustomId("verify")
                        .setLabel("✔️Concordo")
                        .setStyle(ButtonStyle.Success)
                ),
            ],
        });
        if (!sendChannel) {
            return interaction.reply({
                content:
                    "Ops... Não foi possivel atender sua solicitação! Tente depois😓.",
                ephemeral: true,
            });
        } else {
            return interaction.reply({
                content: "Canal de verificação setado com sucesso!🥰.",
                ephemeral: true,
            });
        }
    },
};
