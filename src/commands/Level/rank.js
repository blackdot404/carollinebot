const { SlashCommandBuilder } = require('discord.js');
const { Top } = require('canvafy');
const Level = require('../../models/userGuildLevel');
const Users = require('../../models/userLevel');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('Mostra o TOP 10 do servidor.'),
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
            const topUsers = await Users.findAll({
                order: [['userLevel', 'DESC']],
                limit: 10,
                attributes: ['userId', 'userLevel'],
                where: { guildId },
            });

            if (topUsers.length === 0) {
                return await interaction.reply({
                    content: 'O rank do seu servidor esta vazio.',
                });
            }

            const usersData = await Promise.all(
                topUsers.map(async (user, index) => {
                    try {
                        const discordUser = await client.users.cache.get(
                            user.userId,
                        );

                        return {
                            top: index + 1,
                            avatar: discordUser.displayAvatarURL(),
                            tag: discordUser.tag ?? `${discordUser.username}`,
                            score: user.userLevel,
                        };
                    } catch (error) {
                        console.error(
                            `Erro ao buscar o usuario ${user.userId}:`,
                            error,
                        );
                        return {
                            top: index + 1,
                            avatar: 'https://cdn.discordapp.com/embed/avatars/0.png',
                            tag: 'Desconhecido',
                            score: 0,
                        };
                    }
                }),
            );
            const top = await new Top()
                .setOpacity(0.6)
                .setScoreMessage('Level:') //(Preferred Option)
                .setabbreviateNumber(false) //(Preferred Option)
                .setBackground('color', '#000') //(Preferred Option)
                .setColors({
                    box: '#212121',
                    username: '#ffffff',
                    score: '#ffffff',
                    firstRank: '#f7c716',
                    secondRank: '#9e9e9e',
                    thirdRank: '#94610f',
                }) //(Preferred Option)
                .setUsersData(usersData)
                .build();

            return await interaction.reply({
                files: [
                    {
                        attachment: top,
                        name: `top-${userId}-${guildId}.png`,
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
