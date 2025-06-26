const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const guildMoe = require('../../models/guildMoe');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('moe-setup')
        .setDescription(
            'Configura o sistema de Match com personagens de anime no servidor.',
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption((option) =>
            option
                .setName('canal')
                .setDescription(
                    'Canal que será enviado as mensagens para o bot.',
                )
                .setRequired(true),
        ),
    async execute(interaction) {
        const guildId = interaction.guild.id;
        const channel = interaction.options.getChannel('canal');

        const existingMoe = await guildMoe.findOne({ where: { guildId } });

        if (existingMoe) {
            try {
                await guildMoe.update(
                    {
                        channelId: channel.id,
                    },
                    { where: { guildId } },
                );

                return await interaction.reply({
                    content: 'Sistema de match atualizado :thumbsup: ',
                    ephemeral: true,
                });
            } catch (error) {
                console.log(error);
                return await interaction.reply({
                    content:
                        'Ocorreu um erro na atualizacao do sistema de match, fale com o administrador. :pleading_face: ',
                    ephemeral: true,
                });
            }
        }

        try {
            await guildMoe.create({ guildId, channelId: channel.id });

            return await interaction.reply({
                content: 'Sistema de match configurado :thumbsup: ',
                ephemeral: true,
            });
        } catch (error) {
            console.log(error);
            return await interaction.reply({
                content:
                    'Ocorreu um erro na configuracao do sistema de match, fale com o administrador. :pleading_face: ',
                ephemeral: true,
            });
        }
    },
};
