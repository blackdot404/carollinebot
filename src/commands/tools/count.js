const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const guildMemberCount = require('../../models/guildMemberCount');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('count')
        .setDescription(
            'Seta o canal de voz para contar a quantidade de pessoas no servidor do discord.',
        )
        .addChannelOption((option) =>
            option
                .setName('canal')
                .setDescription(
                    'Canal de voz que ira atualizar a quantidade de membros.',
                )
                .setRequired(true),
        ),
    async execute(interaction) {
        const channelId = interaction.options.getChannel('canal');
        const userMemberCount = await guildMemberCount.findOne({
            where: { guildId: interaction.guild.id },
        });

        if (!userMemberCount) {
            await guildMemberCount.create({
                guildId: interaction.guild.id,
                channelId: channelId.id,
            });

            const embed = new EmbedBuilder()
                .setDescription(
                    '🥰 Canal de voz para contagem de membro setado!',
                )
                .setTimestamp()
                .setColor(10944512);

            return interaction.reply({
                embeds: [embed],
                ephemeral: true,
            });
        } else {
            await guildMemberCount.update(
                {
                    guildId: interaction.guild.id,
                    channelId: channelId.id,
                },
                { where: { guildId: interaction.guild.id } },
            );

            const embed = new EmbedBuilder()
                .setDescription(
                    '🥰 Canal de voz para contagem de membro atualizado!',
                )
                .setTimestamp()
                .setColor(10944512);

            return interaction.reply({
                embeds: [embed],
                ephemeral: true,
            });
        }
    },
};
