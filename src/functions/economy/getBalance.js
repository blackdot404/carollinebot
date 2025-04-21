const Balance = require('../../models/guildBalance');

module.exports = (client) => {
    client.getBalance = async (userId, guildId) => {
        const storedBalance = Balance.findOne({
            where: { userId: userId, guildId: guildId },
        });

        if (!storedBalance) return false;
        else return storedBalance;
    };
};
