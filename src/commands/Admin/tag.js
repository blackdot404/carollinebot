const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
} = require('discord.js');
const userReacts = require('../../models/userReacts');
const guildReactConfig = require('../../models/guildReactConfig');

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
                .setName('config')
                .setDescription(
                    'Configura o canal de texto para emoji, um canal por servidor.',
                )
                .addChannelOption((option) =>
                    option
                        .setName('canal')
                        .setDescription('Insira o canal de texto')
                        .setRequired(true),
                ),
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
    async execute(interaction, client) {
        const subcommand = interaction.options.getSubcommand();

        const userData = await guildReactConfig.findOne({
            where: { guildId: interaction.guild.id },
        });

        switch (subcommand) {
            case 'add': {
                const idEmoji = interaction.options.getString('emoji');
                const idRole = interaction.options.getRole('cargo');
                const idGroup = interaction.options.getInteger('grupo');
                const emojiSplit = idEmoji.replace(/[<@>]/g, '').split(':');

                const userReact = await userReacts.findOne({
                    attributes: ['idEmoji'],
                    where: { idEmoji: emojiSplit[2] },
                });

                if (userData === null) {
                    const embedFailed = new EmbedBuilder()
                        .setDescription(
                            '🤖 Você ainda não configurou o bot, use o comando /tag config',
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

                await userReacts
                    .create({
                        idEmoji: emojiSplit[2],
                        strName: emojiSplit[1],
                        idRole: idRole.id,
                        strRole: idRole.name,
                        idGroup: idGroup,
                        idGuild: userData.guildId,
                        idClassChannel: userData.channelId,
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

                const userReact = await userReacts.findOne({
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

                await userReacts
                    .destroy({
                        where: { idEmoji: emojiSplit[2] },
                    })
                    .then(() => {
                        interaction.reply({
                            embeds: [embedSucess],
                        });
                    });
                break;
            }

            case 'at': {
                const idGroup = interaction.options.getInteger('grupo');
                const tituloEmbed = interaction.options.getString('titulo');

                const userReact = await userReacts.findAll({
                    attributes: ['idGuild', 'idEmoji', 'idRole', 'strName'],
                    where: { idGuild: interaction.guild.id, idGroup: idGroup },
                });
                if (!userReact) {
                    interaction.reply({
                        content: '👎 Nenhum emoji encontrado para esse grupo.',
                    });
                    break;
                }

                if (userData === null) {
                    const embedFailed = new EmbedBuilder()
                        .setDescription(
                            '🤖 Você ainda não configurou o bot, use o comando /tag config',
                        )
                        .setColor(10944512);

                    interaction.reply({
                        embeds: [embedFailed],
                    });
                    break;
                }

                const channel = client.channels.cache.get(userData.channelId);

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
                        .then(
                            console.log(
                                `[EMOJI SYSTEM]: REAGINDO A MENSAGEM: ${messageId.id}, COM O EMOJI ${id.idEmoji}.`,
                            ),
                        )
                        .catch(console.error);
                });

                interaction.reply({
                    content: '🎉 Sistema de reações ativado com sucesso!',
                });

                break;
            }
            case 'config': {
                const channelId = interaction.options.getChannel('canal');

                if (!userData) {
                    await guildReactConfig.create({
                        guildId: interaction.guild.id,
                        channelId: channelId.id,
                    });

                    interaction.reply({
                        content: '🎉 Canal de reações configurado com sucesso!',
                        ephemeral: true,
                    });

                    break;
                } else {
                    await guildReactConfig.update(
                        { channelId: channelId.id },
                        { where: { guildId: interaction.guild.id } },
                    );

                    interaction.reply({
                        content: '🎉 Canal de reações atualizado com sucesso!',
                        ephemeral: true,
                    });

                    break;
                }
            }
            default:
                break;
        }
    },
};
