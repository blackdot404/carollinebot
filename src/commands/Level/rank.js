const { SlashCommandBuilder } = require('discord.js');
const { Top } = require('canvafy');
const Level = require('../../models/userGuildLevel');
const Users = require('../../models/userLevel');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('Mostra o TOP 10 do servidor.'),

    async execute(interaction, client) {
        const guild = interaction.guild;
        const guildId = guild.id;
        const userId = interaction.user.id;

        const existingLevel = await Level.findOne({ where: { guildId } });
        if (!existingLevel) {
            return interaction.reply({
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
                return interaction.reply({
                    content: 'O rank do seu servidor esta vazio.',
                });
            }

            // IDs como string (evita perda de precisão)
            const ids = topUsers.map((u) => String(u.userId));

            // Tenta buscar membros em lote (requer GuildMembers intent)
            let fetchedMembers = new Map();
            try {
                const col = await guild.members.fetch({
                    user: ids,
                    force: true,
                });
                fetchedMembers = col; // Collection<id, GuildMember>
            } catch (e) {
                console.warn(
                    'Falha ao buscar membros em lote (intent?):',
                    e?.message || e,
                );
            }

            const usersData = await Promise.all(
                topUsers.map(async (u, index) => {
                    const id = String(u.userId);

                    // 1) Tenta membro da guild
                    let member = fetchedMembers.get(id);
                    let user = member?.user;

                    // 2) Se não tiver, tenta buscar o User global
                    if (!user) {
                        try {
                            user = await client.users.fetch(id, {
                                force: true,
                            });
                        } catch (e) {
                            // se falhar, continua com undefined e usa fallback
                        }
                    }

                    const name =
                        member?.displayName ??
                        user?.globalName ??
                        user?.username ??
                        `Desconhecido (${id})`;

                    const avatar =
                        member?.displayAvatarURL?.({ size: 256 }) ??
                        user?.displayAvatarURL?.({ size: 256 }) ??
                        'https://cdn.discordapp.com/embed/avatars/0.png';

                    return {
                        top: index + 1,
                        avatar,
                        tag: name, // canvafy espera uma string aqui
                        score: Number(u.userLevel) || 0,
                    };
                }),
            );

            const top = await new Top()
                .setOpacity(0.6)
                .setScoreMessage('Level:')
                .setabbreviateNumber(false)
                .setBackground('color', '#000')
                .setColors({
                    box: '#212121',
                    username: '#ffffff',
                    score: '#ffffff',
                    firstRank: '#f7c716',
                    secondRank: '#9e9e9e',
                    thirdRank: '#94610f',
                })
                .setUsersData(usersData)
                .build();

            return interaction.reply({
                files: [
                    { attachment: top, name: `top-${userId}-${guildId}.png` },
                ],
            });
        } catch (error) {
            console.error('Erro no comando /rank:', error);
            // Evita tentar responder 2x
            if (interaction.deferred || interaction.replied) {
                return;
            }
            return interaction.reply({
                content:
                    'Ocorreu um erro no sistema de level, fale com o administrador. :pleading_face: ',
                ephemeral: true,
            });
        }
    },
};
