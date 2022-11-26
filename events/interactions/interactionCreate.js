const { CommandInteraction } = require("discord.js");
const Schema = require("../../Models/Welcome");

module.exports = {
    name: "interactionCreate",

    execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);

            if (!command) interaction.reply({ content: "outdated command" });

            command.execute(interaction, client);
        } else if (interaction.isButton()) {
            Schema.findOne(
                { Guild: interaction.guild.id },
                async (err, data) => {
                    if (!data) return;
                    const role = interaction.guild.roles.cache.get(data.Role);
                    return interaction.member.roles.add(role).then((member) => {
                        interaction.reply({
                            content: `Acesso ao servidor liberado, bem-vindo(a)!! 🥰`,
                            ephemeral: true,
                        });
                    });
                }
            );
        } else {
            return;
        }
    },
};
