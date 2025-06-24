const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const Level = require('../../models/userGuildLevel');
const UserLevel = require('../../models/userLevel');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('level-disable')
        .setDescription('Desativa o sistema de level do servidor ')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const guildId = interaction.guild.id;
        const existingLevel = await Level.findOne({ where: { guildId } });

        if (!existingLevel) {
            return await interaction.reply({
                content: 'Sistema de level nao esta ativo.',
                ephemeral: true,
            });
        }

        try {
            await Level.delete({ where: { guildId } });
            await UserLevel.delete({ where: { guildId } });

            return interaction.reply({
                content: 'Sistema desabilitado.',
                ephemeral: true,
            });
        } catch (error) {
            await interaction.reply({
                content:
                    'Ocorreu um erro na configuracao do sistema de level, fale com o administrador. :pleading_face: ',
                ephemeral: true,
            });
            return console.log('Error: ', error);
        }
    },
};
