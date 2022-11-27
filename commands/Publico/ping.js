const { SlashCommandBuilder, CommandInteraction } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Return my ping!"),

    async execute(interaction, client) {
        const message = await interaction.deferReply({
            fetchReply: true,
        });

        const newMessage = `API Latency: ${client.ws.ping}ms.\nClient Ping: ${
            message.createdTimestamp - interaction.createdTimestamp
        }ms.`;
        await interaction.editReply({
            content: newMessage,
        }); // Pode ser inserido o criterio 'ephemeral: true' resposta visivel só pra quem mandou o comando.
    },
};
