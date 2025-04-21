const userGuild = require('../../models/userGuild');

module.exports = {
    data: {
        name: 'acceptRules',
    },
    async execute(interaction) {
        const data = await userGuild.findOne({
            attributes: ['Guild', 'Role'],
            where: { Guild: interaction.guild.id },
        });

        if (!data) return;

        const rule = interaction.guild.roles.cache.get(data.Role);
        if (
            interaction.member.roles.cache.some((role) => role.id === data.Role)
        ) {
            return interaction.reply({
                content: 'Você já possui o cargo para utilizar o servidor!',
                ephemeral: true,
            });
        }

        interaction.member.roles.add(rule).then(() => {
            interaction.reply({
                content: 'Acesso ao servidor liberado, bem-vindo(a)!! 🥰',
                ephemeral: true,
            });
        });
    },
};
