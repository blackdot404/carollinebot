const {
    SlashCommandBuilder,
    // CommandInteraction,
    PermissionFlagsBits,
    EmbedBuilder,
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription(
            'Apaga mensagens de acordo com a quantidade de linhas informada.'
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addIntegerOption((option) =>
            option
                .setName('quantidade')
                .setDescription(
                    'Quantidade de mensagens que deve ser apagadas.'
                )
                .setMaxValue(99)
                .setMinValue(1)
                .setRequired(true)
        )
        .addUserOption((option) =>
            option
                .setName('usuario')
                .setDescription('Usuario foco do delete.')
                .setRequired(false)
        ),

    async execute(interaction) {
        const { channel, options } = interaction;

        const amount = options.getInteger('quantidade');
        const target = options.getUser('usuario');

        const messages = await channel.messages.fetch({
            limit: amount + 1,
        });

        const res = new EmbedBuilder().setColor(16312092);

        if (target) {
            let i = 0;
            const filtered = [];

            (await messages).filter((msg) => {
                if (msg.author.id === target.id && amount > i) {
                    filtered.push(msg);
                    i++;
                }
            });

            await channel
                .bulkDelete(filtered)
                .then((messages) => {
                    res.setDescription(
                        `Processo de delete executado em ${messages.size} do usuario ${target} 😎.`
                    );
                    interaction.reply({ embeds: [res] });
                })
                .catch(() => {
                    return interaction.reply({
                        content:
                            'Ops... Mensagens com mais de 10 dias de idade o discord não permite que eu apague 😓.',
                        ephemeral: true,
                    });
                });
        } else {
            await channel
                .bulkDelete(amount, true)
                .then((messages) => {
                    res.setDescription(
                        `Processo de delete executado em ${messages.size} 😎.`
                    );
                    interaction.reply({ embeds: [res] });
                })
                .catch(() => {
                    return interaction.reply({
                        content:
                            'Ops... Mensagens com mais de 10 dias de idade o discord não permite que eu apague 😓.',
                        ephemeral: true,
                    });
                });
        }
    },
};
