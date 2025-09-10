const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Balance = require('../../models/guildBalance');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pagar')
        .setDescription('Efetua um pagamento a um usuario especifico.')
        .addUserOption((option) =>
            option
                .setName('target')
                .setDescription('Qual usuario voce quer enviar o valor.')
                .setRequired(true),
        )
        .addNumberOption((option) =>
            option
                .setName('valor')
                .setDescription('Valor que deseja enviar.')
                .setRequired(true),
        ),
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true });

        const userStoredBalance = await client.fetchBalance(
            interaction.user.id,
            interaction.guild.id,
        );
        let amount = interaction.options.getNumber('valor');
        const selectedUser = interaction.options.getUser('target');

        if (selectedUser.bot || selectedUser.id == interaction.user.id) {
            return await interaction.editReply({
                content: 'Voce não pode mandar para bot ou para voce mesmo.',
                ephemeral: true,
            });
        } else if (amount < 1.0) {
            return await interaction.editReply({
                content: 'O valor inserido tem que ser maior que $1.00',
                ephemeral: true,
            });
        } else if (amount > userStoredBalance.balance) {
            return await interaction.editReply({
                content: 'Voce não tem o valor que deseja enviar.',
                ephemeral: true,
            });
        }

        const selectedUserBalance = await client.fetchBalance(
            selectedUser.id,
            interaction.guild.id,
        );

        amount = await client.toFixedNumber(amount);

        // subtrai o que esta enviando
        await Balance.update(
            {
                balance: await client.toFixedNumber(
                    userStoredBalance.balance - amount,
                ),
            },
            {
                where: {
                    userId: userStoredBalance.userId,
                    guildId: userStoredBalance.guildId,
                },
            },
        );

        // adiciona em que vai receber
        await Balance.update(
            {
                balance: await client.toFixedNumber(
                    selectedUserBalance.balance + amount,
                ),
            },
            {
                where: {
                    userId: selectedUserBalance.userId,
                    guildId: selectedUserBalance.guildId,
                },
            },
        );

        const embed = new EmbedBuilder()
            .setTitle(`Pagamento para ${selectedUser.username}:`)
            .setTimestamp()
            .addFields([
                {
                    name: `:coin: $${amount}`,
                    value: '\u200b',
                },
            ])
            .setFooter({
                text: client.user.tag,
                iconURL: client.user.displayAvatarURL(),
            })
            .setColor(10944512);

        await interaction.editReply({
            embeds: [embed],
            ephemeral: true,
        });
    },
};
