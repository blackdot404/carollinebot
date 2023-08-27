const { CommandInteraction } = require('discord.js');
const Schema = require('../../models/GuildUser');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);

            if (!command) interaction.reply({ content: 'outdated command' });

            command.execute(interaction, client);
        } else if (interaction.isButton()) {
            const data = await Schema.findOne({
                where: { Guild: interaction.guild.id },
            });
            if (!data) return;
            const role = interaction.guild.roles.cache.get(data.Role);

            //caso ele já tenha o cargo para utilizar o servidor
            if (
                interaction.member.roles.cache.some(
                    (role) => role.id === data.Role
                )
            ) {
                return interaction.reply({
                    content: 'Você já possui o cargo para utilizar o servidor!',
                    ephemeral: true,
                });
            }

            //caso não tenha adicionar o cargo
            return interaction.member.roles.add(role).then((member) => {
                interaction.reply({
                    content: 'Acesso ao servidor liberado, bem-vindo(a)!! 🥰',
                    ephemeral: true,
                });
            });
        } else {
            return;
        }
    },
};
