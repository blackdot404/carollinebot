// const { EmbedBuilder } = require('discord.js');
const { LevelUp } = require('canvafy');

const Balance = require('../../models/guildBalance');
const Level = require('../../models/userGuildLevel');
const UserLevel = require('../../models/userLevel');

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        const guildId = message.guild.id;
        const userId = message.author.id;

        if (message.author.bot) return;

        // sistema de moedas

        const randomAmout = Math.random() * (0.7 - 0.3) + 0.3;
        const storedBalance = await client.fetchBalance(userId, guildId);

        await Balance.update(
            {
                balance: await client.toFixedNumber(
                    storedBalance.balance + randomAmout,
                ),
            },
            {
                where: {
                    userId: storedBalance.userId,
                    guildId: storedBalance.guildId,
                },
            },
        );

        // sistema de level

        const existingLevel = await Level.findOne({ where: { guildId } });

        if (!existingLevel) return;

        const randomExp = Math.floor(Math.random() * 10) + 1;
        const storedLevel = await client.fetchLevel(userId, guildId);
        const nextLevelExp = await client.nextLevelUp(storedLevel.userLevel);
        let currentExp = storedLevel.userXp + randomExp;

        const guild = client.guilds.cache.get(guildId);
        const channel = guild.channels.cache.get(existingLevel.channelId);

        console.log(
            `[LEVEL SYSTEM]: ${message.author.username} ganhou ${randomExp} XP! Total: ${currentExp}/${nextLevelExp}`,
        );

        if (currentExp >= nextLevelExp) {
            currentExp -= nextLevelExp;

            let newLevel = storedLevel.userLevel + 1;

            await UserLevel.update(
                { userXp: currentExp, userLevel: newLevel },
                { where: { guildId, userId } },
            );

            if (existingLevel.useEmbed) {
                const levelUp = await new LevelUp()
                    .setAvatar(
                        message.author.displayAvatarURL({
                            forceStatic: true,
                            extension: 'png',
                        }),
                    )
                    .setBackground(
                        'image',
                        'https://raw.githubusercontent.com/blackdot404/carollinebot/refs/heads/main/src/img/levelUpBackground.png',
                    )
                    .setUsername(message.author.username)
                    // .setBorder('#000000')
                    .setAvatarBorder('#f5f5f5')
                    .setOverlayOpacity(0.7)
                    .setLevels(storedLevel.userLevel, newLevel)
                    .build();

                return channel.send({
                    content: `Parabéns <@${storedLevel.userId}>! Subiu de nível 👍`,
                    files: [
                        {
                            attachment: levelUp,
                            name: `levelUp-${message.member.id}.png`,
                        },
                    ],
                });
            } else {
                return channel.send({
                    content: `Parabéns <@${storedLevel.userId}>! Subiu para o nível ${newLevel} 👍`,
                });
            }

            // console.log(
            //     `[LEVEL SYSTEM]: Parabéns ${message.author.tag}! Subiu para o nível ${newLevel}`,
            // );
        }

        await UserLevel.update(
            { userXp: currentExp },
            { where: { guildId: guildId, userId: userId } },
        );
    },
};
