const guildMemberCount = require('../../models/guildMemberCount');

module.exports = (client) => {
    client.memberCounter = async () => {
        setInterval(async () => {
            const data = await guildMemberCount.findAll({ raw: true });

            for (const { guildId, channelId } of data) {
                const guild = client.guilds.cache.get(guildId);
                if (!guild) {
                    console.warn(
                        `[WARN] Guild ${guildId} não encontrada no cache.`,
                    );
                    break;
                }

                const memberCount = guild.memberCount;

                const channel = guild.channels.cache.get(channelId);
                if (!channel) {
                    console.warn(
                        `[WARN] Canal ${channelId} não encontrado no guild ${guildId}.`,
                    );
                    break;
                }

                try {
                    await channel.setName(
                        `👥Membros: ${memberCount.toLocaleString()}`,
                    );
                    console.log(
                        `[UPDATE-COUNT] Canal atualizado para guild ${guildId}`,
                    );
                } catch (err) {
                    console.error(
                        `[ERROR] Erro ao atualizar canal ${channelId}:`,
                        err,
                    );
                }
            }
        }, 3600000);
    };
};
