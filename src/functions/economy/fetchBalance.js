const Balance = require('../../models/guildBalance');

module.exports = (client) => {
    client.fetchBalance = async (userId, guildId) => {
        let storedBalance = await Balance.findOne({
            where: { userId: userId, guildId: guildId },
        });

        if (!storedBalance) {
            storedBalance = await Balance.create({
                userId: userId,
                guildId: guildId,
            });
            console.log(
                `[BALANCE CREATED]: UserId: ${userId}, GuildId: ${guildId}`,
            );

            return storedBalance;
        } else return storedBalance;
    };
};
