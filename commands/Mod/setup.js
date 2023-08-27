const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const welcomeSchema = require('../../models/GuildUser');

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
        if (!data) {
            await welcomeSchema.create({
                Guild: interaction.guild.id,
                Channel: welcomeChannel.id,
                RoleChannel: roleChannel.id,
                Msg: welcomeMessage,
                Role: roleId.id,
            });
        } else {
            const fields = {
                Channel: welcomeChannel.id,
                RoleChannel: roleChannel.id,
                Msg: welcomeMessage,
                Role: roleId.id,
            };

            for (const field in fields) {
                if (data.field !== fields[field]) {
                    await welcomeSchema
                        .update(
                            { [field]: fields[field] },
                            { where: { Guild: interaction.guild.id } }
                        )
                        .then((success) => {
                            console.log(`Tudo certo, ${success}.`);
                        })
                        .catch((error) => {
                            interaction.reply({
                                content:
                                    'Foi encontrado um erro fale com o administrador. 😓',
                                ephemeral: true,
                            });
                            console.log(`Failed to update ${error}.`);
                        });
                }
            }
        }
        interaction.reply({
            content: 'Configuração inicial efetuada!! 🥰',
            ephemeral: true,
        });
    },
};
