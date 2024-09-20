const UserReacts = require('../../models/UserReacts');
const UserGuild = require('../../models/UserGuild');

module.exports = {
    name: 'messageReactionRemove',
    async execute(messageReaction, user) {
        if (user.bot) return;
        const userGuild = await UserGuild.findOne({
            attributes: ['ClassChannel'],
            where: {
                Guild: messageReaction.message.guild.id,
            },
        });

        if (messageReaction.message.channel.id != userGuild.ClassChannel) {
            return;
        }
        const data = await UserReacts.findOne({
            attributes: ['idRole', 'strRole'],
            where: {
                idGuild: messageReaction.message.guild.id,
                idEmoji: messageReaction.emoji.id,
            },
        });

        if (!data || !userGuild) return;

        const guildMember =
            await messageReaction.message.guild.members.cache.get(user.id);

        const role = await messageReaction.message.guild.roles.cache.find(
            (r) => r.name === data.strRole,
        );

        if (!guildMember) return;

        if (guildMember.roles.cache.get(role)) {
            guildMember.roles.remove(role);
        }
    },
};
