const { SlashCommandBuilder } = require('discord.js');
const { Rank } = require('canvafy');
const Level = require('../../models/userGuildLevel');
const UserLevel = require('../../models/userLevel');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('level')
        .setDescription('Mostra seu level'),
    async execute(interaction, client) {
        const guildId = interaction.guild.id;
        const userId = interaction.user.id;
        const existingLevel = await Level.findOne({ where: { guildId } });

        if (!existingLevel) {
            return await interaction.reply({
                content: 'Sistema de level nao esta ativo.',
            });
        }

        try {
            const level = await UserLevel.findOne({
                where: { guildId, userId },
            });

            if (!level) {
                return await interaction.reply({
                    content: 'Voce tem que interagir para ganhar level.',
                    ephemeral: true,
                });
            }
            const nextLevelExp = await client.nextLevelUp(level.userLevel);
            const getUserWithRank = await client.getUserWithRank(
                userId,
                guildId,
            );

            const rank = await new Rank()
                .setAvatar(
                    interaction.user.displayAvatarURL({
                        forceStatic: true,
                        extension: 'png',
                    }),
                )
                .setBackground(
                    'image',
                    'https://raw.githubusercontent.com/blackdot404/carollinebot/ea2a029b88e1e53c6cbd0ca1e6b177542e8e0a7b/src/img/bg_level.png',
                )
                .setUsername(interaction.user.username)
                // .setBorder('#000')
                // .setStatus(interaction.member.presence?.status)
                .setLevel(level.userLevel)
                .setBarColor('#9b59b6')
                .setRank(getUserWithRank.position)
                .setCurrentXp(level.userXp)
                .setRequiredXp(nextLevelExp)
                .build();

            return interaction.reply({
                files: [
                    {
                        attachment: rank,
                        name: `rank-${userId}.png`,
                    },
                ],
            });
        } catch (error) {
            await interaction.reply({
                content:
                    'Ocorreu um erro no sistema de level, fale com o administrador. :pleading_face: ',
                ephemeral: true,
            });
            return console.log('Error: ', error);
        }
    },
};
