const {
    EmbedBuilder,
    ButtonStyle,
    ActionRowBuilder,
    ButtonBuilder,
    SlashCommandBuilder,
    // CommandInteraction,
    PermissionFlagsBits,
} = require('discord.js');
const Schema = require('../../Models/Welcome');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('createverify')
        .setDescription('Cria um botão de verificação para novos membros.')
        // .addChannelOption((option) =>
        //     option
        //         .setName("canal")
        //         .setDescription("Envia um texto para o canal.")
        //         .setRequired(true)
        // )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        Schema.findOne({ Guild: interaction.guild.id }, async (err, data) => {
            if (!data) return;
            const channel = await interaction.guild.channels.cache.get(
                data.RoleChannel
            );
            const verifyEmbed = new EmbedBuilder()
                .setTitle(':name_badge: Regras do Servidor :name_badge:')
                .setDescription(
                    'Clique no botão se você concorda com as regras apresentadas acima.'
                )
                .setColor(16312092);
            let sendChannel = channel.send({
                embeds: [verifyEmbed],
                components: [
                    new ActionRowBuilder().setComponents(
                        new ButtonBuilder()
                            .setCustomId('verify')
                            .setLabel('✔️Concordo')
                            .setStyle(ButtonStyle.Success)
                    ),
                ],
            });
            if (!sendChannel) {
                return interaction.reply({
                    content:
                        'Ops... Não foi possivel atender sua solicitação! Tente depois😓.',
                    ephemeral: true,
                });
            } else {
                return interaction.reply({
                    content: 'Canal de verificação setado com sucesso!🥰.',
                    ephemeral: true,
                });
            }
        });
    },
};
