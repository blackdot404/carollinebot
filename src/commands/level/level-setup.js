const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const level = require('../../models/userGuildLevel');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('level-setup')
        .setDescription('Configura o sistema de level no servidor.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption((option) =>
            option
                .setName('canal')
                .setDescription('Canal que será enviado as mensagens de xp.')
                .setRequired(true),
        )
        .addBooleanOption((option) =>
            option
                .setName('embed')
                .setDescription('Enviar as mensagem de levelUp como embed.')
                .setRequired(false),
        ),
    async execute(interaction) {
        try {
            const channel = interaction.options.getChannel('canal');
            const useEmbed = interaction.options.getBoolean('embed') || false;
            const guildId = interaction.guild.id;
            const channelId = channel.id;

            const existingLevel = await level.findOne({
                where: { guildId: guildId },
            });

            if (existingLevel) {
                await level.update(
                    {
                        channelId: channelId,
                        useEmbed: useEmbed,
                    },
                    { where: { guildId: guildId } },
                );

                return await interaction.reply({
                    content:
                        'Sistema de level atualizado com sucesso. :thumbsup:',
                    ephemeral: true,
                });
            }

            await level.create({
                guildId,
                channelId,
                useEmbed,
            });

            return await interaction.reply({
                content: 'Sistema de level configurado com sucesso. :thumbsup:',
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
