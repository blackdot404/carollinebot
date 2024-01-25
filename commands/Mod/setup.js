const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const welcomeSchema = require('../../Models/GuildUser');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription(
            'Comando para auxiliar você na configuração inicial do Bot.'
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption((option) =>
            option
                .setName('canal')
                .setDescription('Canal de mensagem de boas vidas.')
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('mensagem')
                .setDescription('Seta a mensagem de boas vindas.')
                .setRequired(true)
        )
        .addRoleOption((option) =>
            option
                .setName('cargo')
                .setDescription(
                    'Seta o cargo que o usuario irá receber quando concordar com as regras.'
                )
                .setRequired(true)
        )
        .addChannelOption((option) =>
            option
                .setName('canal-regras')
                .setDescription('Canal com as regras do servidor.')
                .setRequired(true)
        ),

    async execute(interaction) {
        const { options } = interaction;

        const welcomeChannel = options.getChannel('canal');
        const welcomeMessage = options.getString('mensagem');
        const roleId = options.getRole('cargo');
        const roleChannel = options.getChannel('canal-regras');

        if (
            !interaction.guild.members.me.permissions.has(
                PermissionFlagsBits.SendMessages
            )
        ) {
            interaction.reply({
                content:
                    'Você não possui a permissão necessaria para esse procedimento.🤫',
                ephemeral: true,
            });
        }

        const data = await welcomeSchema.findOne({
            where: { Guild: interaction.guild.id },
        });
        if (data === null) {
            await welcomeSchema.create({
                Guild: interaction.guild.id,
                Channel: welcomeChannel.id,
                RoleChannel: roleChannel.id,
                Msg: welcomeMessage,
                Role: roleId.id,
            });
        } else {
            await welcomeSchema.update(
                {
                    Channel: welcomeChannel.id,
                    RoleChannel: roleChannel.id,
                    Msg: welcomeMessage,
                    Role: roleId.id,
                },
                { where: { Guild: interaction.guild.id } }
            );
        }
        interaction.reply({
            content: 'Configuração inicial efetuada!! 🥰',
            ephemeral: true,
        });
    },
};
