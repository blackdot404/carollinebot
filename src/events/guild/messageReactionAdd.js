const userReacts = require('../../models/userReacts');
const guildReactConfig = require('../../models/guildReactConfig');

module.exports = {
    name: 'messageReactionAdd',
    async execute(messageReaction, user) {
        if (user.bot) return;
        const userGuilds = await guildReactConfig.findOne({
            attributes: ['channelId'],
            where: {
                guildId: messageReaction.message.guild.id,
            },
        });

        if (!userGuilds) return;

        if (messageReaction.message.channel.id != userGuilds.channelId) {
            return;
        }
        const data = await userReacts.findOne({
            attributes: ['idRole', 'strRole'],
            where: {
                idGuild: messageReaction.message.guild.id,
                idEmoji: messageReaction.emoji.id,
            },
        });

        if (!data || !userGuilds) return;

        const guildMember =
            await messageReaction.message.guild.members.cache.get(user.id);

        const role = await messageReaction.message.guild.roles.cache.find(
            (r) => r.name === data.strRole,
        );

        if (!role || !guildMember) return;

        if (!guildMember.roles.cache.get(role)) {
            guildMember.roles.add(role);
        }
    },
};
