const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
} = require('discord.js');
const UserGuild = require('../../models/UserGuild');

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
        // .addChannelOption((option) =>
        //     option
        //         .setName('canal-recruit')
        //         .setDescription('Canal para recrutamento do novato.')
        //         .setRequired(true),
        // )
        .addChannelOption((option) =>
            option
                .setName('canal-classes')
                .setDescription('Canal para o novato escolher as tags.')
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
        // const RecruitChannel = options.getChannel('canal-recruit');
        const ClassChannel = options.getChannel('canal-classes');

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
            interaction.reply({
                embeds: [embedFailed],
                ephemeral: true,
            });
        }

        const data = await UserGuild.findOne({
            where: { Guild: interaction.guild.id },
        });
        if (!data) {
            await UserGuild.create({
                Guild: interaction.guild.id,
                Channel: Channel.id,
                RoleChannel: RoleChannel.id,
                ClassChannel: ClassChannel.id,
                Msg: Msg,
                Role: Role.id,
            })
                .then(() => {
                    interaction.reply({
                        embeds: [embedSucess],
                        ephemeral: true,
                    });
                })
                .catch((err) => {
                    console.log(err);
                    interaction.reply({
                        embeds: [embedFailed],
                        ephemeral: true,
                    });
                });
        } else {
            await UserGuild.update(
                {
                    Channel: Channel.id,
                    RoleChannel: RoleChannel.id,
                    ClassChannel: ClassChannel.id,
                    Msg: Msg,
                    Role: Role.id,
                },
                { where: { Guild: interaction.guild.id } },
            )
                .then(() => {
                    interaction.reply({
                        embeds: [embedSucess],
                        ephemeral: true,
                    });
                })
                .catch((err) => {
                    console.log(err);
                    interaction.reply({
                        embeds: [embedFailed],
                        ephemeral: true,
                    });
                });
        }
    },
};
