const { Op } = require('sequelize');

const User = require('../../models/userLevel');

module.exports = (client) => {
    client.getUserWithRank = async (userId, guildId) => {
        const user = await User.findOne({ where: { guildId, userId } });

        if (!user) return; // usuario nao encontrado

        const { userLevel } = user;

        const higherLevelCount = await User.count({
            where: {
                userLevel: {
                    [Op.gt]: userLevel,
                },
            },
        });

        return {
            id: userId,
            position: higherLevelCount + 1,
        };
    };
};
