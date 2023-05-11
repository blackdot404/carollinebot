const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Retorno a latencia atual com a API do discord.'),

    async execute(interaction, client) {
        // const message = await interaction.deferReply({
        //     fetchReply: true,
        // });

        // const newMessage = `API Latency: ${client.ws.ping}ms.\nClient Ping: ${
        //     message.createdTimestamp - interaction.createdTimestamp
        // }ms.`;

        const newMessageEmbed = new EmbedBuilder()
            .setColor(16312092)
            .setTitle('Ping 🏓')
            .setDescription(`Bot Latency: ${client.ws.ping}ms. :comet:`)
            .setTimestamp()
            .setFooter({
                text: interaction.user.username,
                iconURL: interaction.user.avatarURL(),
            });

        await interaction.reply({
            embeds: [newMessageEmbed],
        }); // Pode ser inserido o criterio 'ephemeral: true' resposta visivel só pra quem mandou o comando.
    },
};
