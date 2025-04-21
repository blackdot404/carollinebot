const Balance = require('../../models/guildBalance');

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot) return;

        const randomAmout = Math.random() * (0.7 - 0.3) + 0.3;
        const storedBalance = await client.fetchBalance(
            message.author.id,
            message.guild.id,
        );

        await Balance.update(
            {
                balance: await client.toFixedNumber(
                    storedBalance.balance + randomAmout,
                ),
            },
            {
                where: {
                    userId: storedBalance.userId,
                    guildId: storedBalance.guildId,
                },
            },
        );
    },
};
