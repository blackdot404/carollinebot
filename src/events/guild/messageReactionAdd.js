const userReacts = require('../../models/userReacts');
const userGuild = require('../../models/userGuild');

module.exports = {
    name: 'messageReactionAdd',
    async execute(messageReaction, user) {
        if (user.bot) return;
        const userGuilds = await userGuild.findOne({
            attributes: ['ClassChannel'],
            where: {
                Guild: messageReaction.message.guild.id,
            },
        });

        if (messageReaction.message.channel.id != userGuilds.ClassChannel) {
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
