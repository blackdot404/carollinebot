const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const fs = require('fs');

module.exports = (client) => {
    client.handleCommands = async () => {
        const commandFolders = fs.readdirSync('./src/commands');

        for (const folder of commandFolders) {
            const commandFiles = fs
                .readdirSync(`./src/commands/${folder}`)
                .filter((file) => file.endsWith('.js'));

            const { commands, commandArray } = client;
            for (const file of commandFiles) {
                const command = require(`../../commands/${folder}/${file}`);
                commands.set(command.data.name, command);
                commandArray.push(command.data.toJSON());
                console.log(
                    `[COMANDOS]: efetuado a leitura do ${command.data.name} com sucesso.`,
                );
            }
        }
        const clientId = process.env.BOT_ID;

        const rest = new REST({ version: '10' }).setToken(
            process.env.BOT_TOKEN,
        );

        // deleta os comandos para depois imputa novamente
        // await rest
        //     .put(Routes.applicationCommands(clientId), { body: [] })
        //     .then(() => console.log('Todos os comandos deletados com sucesso.'))
        //     .catch(console.error);

        try {
            console.log(
                '[DISCORD-API]: Importando comandos (/) da aplicação para o servidor Discord.',
            );
            await rest.put(Routes.applicationCommands(clientId), {
                body: client.commandArray,
            });

            console.log(
                '[DISCORD-API]: Importação dos comandos (/) da aplicação efetuada com sucesso.',
            );
        } catch (error) {
            console.error(error);
        }
    };
};
