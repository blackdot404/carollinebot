const userGuild = require('../../models/userGuild');

module.exports = {
    name: 'guildDelete',
    async execute(guild) {
        await userGuild.destroy({ where: { Guild: guild.id } });

        console.log(
            `[DATABASE]: Guilda apagada do banco de dados '${guild.name}'`,
        );
    },
};
