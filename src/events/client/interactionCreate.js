module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            const { commands } = client;
            const { commandName } = interaction;
            const command = commands.get(commandName);
            if (!command) return;

            try {
                await command.execute(interaction, client);
            } catch (error) {
                console.log(error);
                await interaction.reply({
                    content:
                        'Houve um problema para executar o comando, fale com um administrador.',
                    ephemeral: true,
                });
            }
        } else if (interaction.isButton()) {
            const { buttons } = client;
            const { customId } = interaction;
            const button = buttons.get(customId);
            if (!button) {
                return new Error('Não a informações sobre esse botão.');
            }

            try {
                await button.execute(interaction, client);
            } catch (error) {
                console.log(error);
                await interaction.reply({
                    content:
                        'Houve um problema para executar o comando, fale com um administrador.',
                    ephemeral: true,
                });
            }
        }
    },
};
