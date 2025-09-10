const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
} = require('discord.js');
const userGuild = require('../../models/userGuild');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription('Configura algumas informações basicas para o bot.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption((option) =>
            option
                .setName('canal-boasvindas')
                .setDescription('Canal de mensagem de boas vidas.')
                .setRequired(true),
        )
        .addChannelOption((option) =>
            option
                .setName('canal-regras')
                .setDescription('Canal com as regras do servidor.')
                .setRequired(true),
        )
        .addRoleOption((option) =>
            option
                .setName('cargo')
                .setDescription(
                    'Seta o cargo que o usuario irá receber quando concordar com as regras.',
                )
                .setRequired(true),
        )
        .addStringOption((option) =>
            option
                .setName('mensagem')
                .setDescription('Seta a mensagem de boas vindas.')
                .setRequired(true),
        ),
    async execute(interaction) {
        const { options } = interaction;
        const Channel = options.getChannel('canal-boasvindas');
        const Msg = options.getString('mensagem');
        const Role = options.getRole('cargo');
        const RoleChannel = options.getChannel('canal-regras');

        await interaction.deferReply({ ephemeral: true });

        const embedSucess = new EmbedBuilder()
            .setDescription('🥰 Configuração inicial efetuada!!')
            .setColor(0x0099ff);

        const embedFailed = new EmbedBuilder()
            .setDescription(
                '🤫 Você não possui a permissão necessaria para esse procedimento.',
            )
            .setColor(10944512);

        if (
            !interaction.guild.members.me.permissions.has(
                PermissionFlagsBits.SendMessages,
            )
        ) {
            interaction.editReply({
                embeds: [embedFailed],
                ephemeral: true,
            });
        }

        const data = await userGuild.findOne({
            where: { Guild: interaction.guild.id },
        });
        if (!data) {
            await userGuild
                .create({
                    Guild: interaction.guild.id,
                    Channel: Channel.id,
                    RoleChannel: RoleChannel.id,
                    Msg: Msg,
                    Role: Role.id,
                })
                .then(() => {
                    interaction.editReply({
                        embeds: [embedSucess],
                        ephemeral: true,
                    });
                })
                .catch((err) => {
                    console.log(err);
                    interaction.editReply({
                        embeds: [embedFailed],
                        ephemeral: true,
                    });
                });
        } else {
            await userGuild
                .update(
                    {
                        Channel: Channel.id,
                        RoleChannel: RoleChannel.id,
                        Msg: Msg,
                        Role: Role.id,
                    },
                    { where: { Guild: interaction.guild.id } },
                )
                .then(() => {
                    interaction.editReply({
                        embeds: [embedSucess],
                        ephemeral: true,
                    });
                })
                .catch((err) => {
                    console.log(err);
                    interaction.editReply({
                        embeds: [embedFailed],
                        ephemeral: true,
                    });
                });
        }
    },
};
