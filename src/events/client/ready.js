const { ActivityType } = require('discord.js');

module.exports = {
    name: 'ready',
    async execute(client) {
        console.log(`[INSTANCIA]: ${client.user.tag} online!`);
        client.memberCounter();

        const status = [
            {
                name: '📌 /help saiba mais',
                type: ActivityType.Listening,
            },
            {
                name: '🥰 Avatar by @.pessoinha',
                type: ActivityType.Streaming,
            },
        ];

        setInterval(() => {
            const random = Math.floor(Math.random() * status.length);

            client.user.setActivity(status[random]);
        }, 10000);
    },
};
