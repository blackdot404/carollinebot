const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const guildPokedex = require('../../models/guildPokedex');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pokedex-setup')
        .setDescription('Configura o sistema da pokedex no servidor.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption((option) =>
            option
                .setName('canal')
                .setDescription(
                    'Canal que será enviado as mensagens da pokedex.',
                )
                .setRequired(true),
        ),
    async execute(interaction) {
        const channel = interaction.options.getChannel('canal');
    },
};
