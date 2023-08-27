const {
    EmbedBuilder,
    ButtonStyle,
    ActionRowBuilder,
    ButtonBuilder,
    SlashCommandBuilder,
    CommandInteraction,
    PermissionFlagsBits,
} = require('discord.js');
const Schema = require('../../Models/GuildUser');

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
        const data = await Schema.findOne({
            where: { Guild: interaction.guild.id },
        });
        if (!data) {
            return interaction.reply({
                content:
                    'Você não configurou o bot para o seu servidor utilize o comando abaixo e efetue a configuração. ```/setup```',
                ephemeral: true,
            });
        }

        try {
            const channel = await interaction.guild.channels.fetch(
                data.RoleChannel
            );

            const verifyEmbed = new EmbedBuilder()
                .setTitle(':name_badge: Regras do Servidor :name_badge:')
                .setDescription(
                    'Clique no botão se você concorda com as regras apresentadas acima.'
                )
                .setColor(16312092);
            channel.send({
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
        } catch (err) {
            console.error(err);
            return interaction.reply({
                content:
                    'Ops... Não foi possivel atender sua solicitação! Tente depois😓.',
                ephemeral: true,
            });
        }
        return interaction.reply({
            content: 'Canal de verificação setado com sucesso!🥰.',
            ephemeral: true,
        });
    },
};
