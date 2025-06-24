const UserLevel = require('../../models/userLevel');

module.exports = (client) => {
    client.fetchLevel = async (userId, guildId) => {
        let storedLevel = await UserLevel.findOne({
            where: { userId: userId, guildId: guildId },
        });

        if (!storedLevel) {
            storedLevel = await UserLevel.create({
                userId: userId,
                guildId: guildId,
            });
            console.log(
                `[LEVEL CREATE]: UserId: ${userId}, GuildId: ${guildId}`,
            );

            return storedLevel;
        } else return storedLevel;
    };
};
