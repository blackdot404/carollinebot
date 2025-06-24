/*eslint indent: "error"*/
const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
} = require('discord.js');

const userGuildSettings = require('../../models/userGuildSettings');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Configura o sistema de log e demais sistemas do bot.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand((subcommand) =>
            subcommand
                .setName('log')
                .setDescription('Configura o sistema de log')
                .addChannelOption((option) =>
                    option
                        .setName('canal-log')
                        .setDescription('Seta o canal de log do servidor.')
                        .setRequired(true),
                ),
        ),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        const data = await userGuildSettings.findOne({
            attributes: ['Guild'],
            where: { Guild: interaction.guild.id },
        });

        switch (subcommand) {
            case 'log': {
                const logChannel = interaction.options.getChannel('canal-log');

                const embedSuccess = new EmbedBuilder()
                    .setDescription(
                        '🎉 O canal de log foi configurado com sucesso.',
                    )
                    .setColor(0x0099ff);

                if (!data) {
                    await userGuildSettings.create({
                        Guild: interaction.guild.id,
                        LogChannel: logChannel.id,
                    });
                } else {
                    await userGuildSettings.update(
                        { LogChannel: logChannel.id },
                        { where: { Guild: interaction.guild.id } },
                    );
                }

                interaction.reply({
                    embeds: [embedSuccess],
                    ephemeral: true,
                });
                break;
            }
        }
    },
};
