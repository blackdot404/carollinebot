const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('saldo')
        .setDescription('Retorna saldo em banco do usuario especifico.')
        .addUserOption((option) =>
            option
                .setName('target')
                .setDescription('Qual usuario voce quer consultar.'),
        ),
    async execute(interaction, client) {
        const selectedUser =
            interaction.options.getUser('target') || interaction.user;

        await interaction.deferReply({ ephemeral: true });

        const storedBalance = await client.getBalance(
            selectedUser.id,
            interaction.guild.id,
        );

        if (!storedBalance)
            return await interaction.editReply({
                content: `${selectedUser.tag}, usuario nao tem conta no banco.`,
                ephemeral: true,
            });
        else {
            const embed = new EmbedBuilder()
                .setTitle(`Saldo de ${selectedUser.username}:`)
                .setTimestamp()
                .addFields([
                    {
                        name: `:coin: $${storedBalance.balance}`,
                        value: '\u200b',
                    },
                ])
                .setFooter({
                    text: client.user.tag,
                    iconURL: client.user.displayAvatarURL(),
                })
                .setColor(10944512);

            await interaction.editReply({ embeds: [embed], ephemeral: true });
        }
    },
};
