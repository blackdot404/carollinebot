// const { CommandInteraction } = require('discord.js');
const Schema = require('../../Models/Welcome');

module.exports = {
    name: 'interactionCreate',

    execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);

            if (!command) interaction.reply({ content: 'outdated command' });

            command.execute(interaction, client);
        } else if (interaction.isButton()) {
            Schema.findOne({ Guild: interaction.guild.id }, async (data) => {
                if (!data) return;
                const role = interaction.guild.roles.cache.get(data.Role);

                //caso ele já tenha o cargo para utilizar o servidor
                if (
                    interaction.member.roles.cache.some(
                        (role) => role.id === data.Role
                    )
                ) {
                    return interaction.reply({
                        content:
                            'Você já possui o cargo para utilizar o servidor!',
                        ephemeral: true,
                    });
                }

                //caso não tenha adicionar o cargo
                return interaction.member.roles.add(role).then(() => {
                    interaction.reply({
                        content:
                            'Acesso ao servidor liberado, bem-vindo(a)!! 🥰',
                        ephemeral: true,
                    });
                });
            });
        } else {
            return;
        }
    },
};
