const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Retorna o tempo de resposta do servidor.'),
    async execute(interaction, client) {
        const message = await interaction.deferReply({
            fetchReply: true,
        });

        const name = `${client.user.username}`;
        const icon = `${client.user.displayAvatarURL()}`;
        const servercount = await client.guilds.cache.reduce(
            (a, b) => a + b.memberCount,
            0,
        );

        //uptime
        let totalSeconds = client.uptime / 1000;
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);

        const uptime = `${days} dias, ${hours} horas, ${minutes} minutos, ${seconds} segundos.`;

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('Suporte Bot')
                .setStyle(ButtonStyle.Link)
                .setURL('https://discord.gg/DqJSRPGjqQ'),

            new ButtonBuilder()
                .setLabel('Convidar Bot')
                .setStyle(ButtonStyle.Link)
                .setURL(
                    'https://discord.com/oauth2/authorize?client_id=825379423892799518&scope=bot&permissions=8',
                ),
        );

        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setAuthor({ name: name, iconURL: icon })
            .setThumbnail(icon)
            .addFields({
                name: ':file_cabinet: Servidores',
                value: `${client.guilds.cache.size}`,
                inline: false,
            })
            .addFields({
                name: ':busts_in_silhouette: Membros',
                value: `${servercount}`,
                inline: false,
            })
            .addFields({
                name: ':satellite: Latencia',
                value: `${client.ws.ping}ms.`,
                inline: true,
            })
            .addFields({
                name: ':globe_with_meridians: Online',
                value: `\`\`\`${uptime}\`\`\``,
                inline: false,
            })
            .setFooter({
                text: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL(),
            })
            .setTimestamp();

        await interaction.editReply({
            content: '🏓 Pong',
            embeds: [embed],
            components: [row],
        });
    },
};
