const UserGuild = require('../../models/UserGuild');

module.exports = {
    name: 'guildDelete',
    async execute(guild) {
        await UserGuild.destroy({ where: { Guild: guild.id } });

        console.log(
            `[DATABASE]: Guilda apagada do banco de dados '${guild.name}'`,
        );
    },
};
