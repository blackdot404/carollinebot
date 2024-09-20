const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Retorna o tempo de resposta do servidor.'),
    async execute(interaction, client) {
        const message = await interaction.deferReply({
            fetchReply: true,
        });

        const newEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('🏓 Pong')
            .setDescription(
                `Latencia API: ${client.ws.ping}ms.\nClient Ping: ${
                    message.createdTimestamp - interaction.createdTimestamp
                }ms.`,
            )
            .setFooter({
                text: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL(),
            })
            .setTimestamp();

        await interaction.editReply({
            embeds: [newEmbed],
        });
    },
};
