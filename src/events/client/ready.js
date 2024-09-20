const { ActivityType } = require('discord.js');
module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`[INSTANCIA]: ${client.user.tag} online!`);

        const status = [
            {
                name: '📌 /help saiba mais',
                type: ActivityType.Custom,
            },
            {
                name: '🥰 Avatar by @.pessoinha',
                type: ActivityType.Custom,
            },
        ];

        setInterval(() => {
            const random = Math.floor(Math.random() * status.length);

            client.user.setActivity(status[random]);
        }, 10000);
    },
};
