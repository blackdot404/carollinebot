const guildMemberCount = require('../../models/guildMemberCount');

module.exports = (client) => {
    client.memberCounter = async (guildId) => {
        const data = await guildMemberCount.findOne({
            where: { guildId: guildId },
        });

        if (!data) return;

        const { channelId } = data;
        const guild = client.guilds.cache.get(guildId);
        if (!guild) {
            console.warn(`[WARN] Guild ${guildId} não encontrada no cache.`);
            return;
        }

        const memberCount = guild.memberCount;

        const channel = guild.channels.cache.get(channelId);
        if (!channel) {
            console.warn(
                `[WARN] Canal ${channelId} não encontrado no guild ${guildId}.`,
            );
            return;
        }

        try {
            await channel.setName(`👥Membros: ${memberCount.toLocaleString()}`);
            console.log(
                `[COUNTER] Canal atualizado para guild ${guildId} membros: ${memberCount}`,
            );
            return;
        } catch (err) {
            console.error(`[ERROR] Erro ao atualizar canal ${channelId}:`, err);
            return;
        }
    };
};
