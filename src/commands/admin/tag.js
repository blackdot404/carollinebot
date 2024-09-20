/* eslint no-case-declarations: "error"*/
/* eslint-env es6*/

const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
} = require('discord.js');
const UserReacts = require('../../models/UserReacts');
const UserGuild = require('../../models/UserGuild');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tag')
        .setDescription('Configura o sistema de cargo do bot.')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('add')
                .setDescription('Adiciona emoji ao sistema de reação.')
                .addStringOption((option) =>
                    option
                        .setName('emoji')
                        .setDescription('Insira o ID do emoji')
                        .setRequired(true),
                )
                .addRoleOption((option) =>
                    option
                        .setName('cargo')
                        .setDescription(
                            'Insira o cargo que irá receber esse emoji',
                        )
                        .setRequired(true),
                )
                .addIntegerOption((option) =>
                    option
                        .setName('grupo')
                        .setDescription(
                            'Inserir um id para agrupar o sistema de tag',
                        )
                        .setRequired(true),
                ),
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('rm')
                .setDescription('Remove emoji do sistema de reação.')
                .addStringOption((option) =>
                    option
                        .setName('emoji')
                        .setDescription('Insira o ID do emoji')
                        .setRequired(true),
                ),
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('at')
                .setDescription(
                    'Ativa o sistema de reação de um grupo especifico.',
                )
                .addIntegerOption((option) =>
                    option
                        .setName('grupo')
                        .setDescription('Insira o grupo que deseja ativar')
                        .setRequired(true),
                )
                .addStringOption((option) =>
                    option
                        .setName('titulo')
                        .setDescription(
                            'Insira um titulo para o sistema de reacao.',
                        )
                        .setRequired(true),
                ),
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('ttl')
                .setDescription('Testa o retorno userguilda')
                .addStringOption((option) =>
                    option
                        .setName('emoji')
                        .setDescription('Insira o ID do emoji')
                        .setRequired(true),
                ),
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
    async execute(interaction, client) {
        const subcommand = interaction.options.getSubcommand();

        const userGuild = await UserGuild.findOne({
            attributes: ['Guild', 'ClassChannel'],
            where: { Guild: interaction.guild.id },
        });

        switch (subcommand) {
            case 'add': {
                const idEmoji = interaction.options.getString('emoji');
                const idRole = interaction.options.getRole('cargo');
                const idGroup = interaction.options.getInteger('grupo');
                const emojiSplit = idEmoji.replace(/[<@>]/g, '').split(':');

                const userReact = await UserReacts.findOne({
                    attributes: ['idEmoji'],
                    where: { idEmoji: emojiSplit[2] },
                });

                if (userGuild === null) {
                    const embedFailed = new EmbedBuilder()
                        .setDescription(
                            '🤖 Você ainda não configurou o bot, use o comando /config',
                        )
                        .setColor(10944512);

                    interaction.reply({
                        embeds: [embedFailed],
                    });
                    break;
                }
                const embedFailed = new EmbedBuilder()
                    .setDescription(
                        '👎 Você está tentando inserir um Emoji que já está cadastrado.',
                    )
                    .setColor(10944512);
                const embedSucess = new EmbedBuilder()
                    .setDescription('🌌 Emoji & Cargo cadastrado com sucesso!!')
                    .setColor(0x0099ff);

                if (userReact) {
                    interaction.reply({
                        embeds: [embedFailed],
                    });
                }

                await UserReacts.create({
                    idEmoji: emojiSplit[2],
                    strName: emojiSplit[1],
                    idRole: idRole.id,
                    strRole: idRole.name,
                    idGroup: idGroup,
                    idGuild: userGuild.Guild,
                    idClassChannel: userGuild.ClassChannel,
                })
                    .then(() => {
                        interaction.reply({
                            embeds: [embedSucess],
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                        interaction.reply({
                            content:
                                'Erro na importação por gentileza procurar um administrador.',
                        });
                    });
                break;
            }
            case 'rm': {
                const idEmoji = interaction.options.getString('emoji');
                const emojiSplit = idEmoji.replace(/[<@>]/g, '').split(':');

                const userReact = await UserReacts.findOne({
                    attributes: ['idEmoji'],
                    where: { idEmoji: emojiSplit[2] },
                });

                const embedFailed = new EmbedBuilder()
                    .setDescription(
                        '👎 Esse emoji não está cadastrado no sistema.',
                    )
                    .setColor(10944512);
                const embedSucess = new EmbedBuilder()
                    .setDescription('🧺 Emoji apagado com sucesso.')
                    .setColor(0x0099ff);

                if (!userReact) {
                    interaction.reply({
                        embeds: [embedFailed],
                    });
                }

                await UserReacts.destroy({
                    where: { idEmoji: emojiSplit[2] },
                }).then(() => {
                    interaction.reply({
                        embeds: [embedSucess],
                    });
                });
                break;
            }

            case 'at': {
                const idGroup = interaction.options.getInteger('grupo');
                const tituloEmbed = interaction.options.getString('titulo');

                const userReact = await UserReacts.findAll({
                    attributes: ['idGuild', 'idEmoji', 'idRole', 'strName'],
                    where: { idGuild: interaction.guild.id, idGroup: idGroup },
                });
                if (!userReact) {
                    interaction.reply({
                        content: '👎 Nenhum emoji encontrado para esse grupo.',
                    });
                    break;
                }

                if (userGuild === null) {
                    const embedFailed = new EmbedBuilder()
                        .setDescription(
                            '🤖 Você ainda não configurou o bot, use o comando /config',
                        )
                        .setColor(10944512);

                    interaction.reply({
                        embeds: [embedFailed],
                    });
                    break;
                }

                const channel = client.channels.cache.get(
                    userGuild.ClassChannel,
                );

                const embedSucessEmojis = new EmbedBuilder()
                    .setTitle(tituloEmbed)
                    .setDescription(
                        userReact
                            .map(
                                (id) =>
                                    `<:${id.strName}:${id.idEmoji}> <@&${id.idRole}>`,
                            )
                            .join('\n'),
                    )
                    .setColor(0x0099ff)
                    .setTimestamp();

                const messageId = await channel.send({
                    embeds: [embedSucessEmojis],
                });

                userReact.forEach((id) => {
                    messageId
                        .react(interaction.guild.emojis.cache.get(id.idEmoji))
                        .then()
                        .catch(console.error);
                });

                interaction.reply({
                    content: '🎉 Sistema de reações ativado com sucesso!',
                });

                break;
            }
            default:
                break;
        }
    },
};
