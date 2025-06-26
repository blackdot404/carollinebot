const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
} = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Lista todos os comandos disponivel no Bot.'),
    async execute(interaction, client) {
        const userId = interaction.user.id;
        const commandFolders = fs
            .readdirSync('./src/commands')
            .filter((folder) => !folder.startsWith('.'));
        const commandsByCategory = {};

        for (const folder of commandFolders) {
            const commandFiles = fs
                .readdirSync(`./src/commands/${folder}`)
                .filter((file) => file.endsWith('.js'));

            const commands = [];

            for (const file of commandFiles) {
                const { default: command } = await import(
                    `./../${folder}/${file}`
                );
                commands.push({
                    name: command.data.name,
                    description: command.data.description,
                });
            }

            commandsByCategory[folder] = commands;
        }
        const dropDownOptions = Object.keys(commandsByCategory).map(
            (folder) => ({
                label: folder,
                value: folder,
            }),
        );

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('category-select')
            .setPlaceholder('Selecione a Categoria')
            .addOptions(
                ...dropDownOptions.map((option) => ({
                    label: option.label,
                    value: option.value,
                })),
            );

        const embed = new EmbedBuilder()
            .setTitle('Menu de Ajuda')
            .setDescription(
                `Selecione a categoria no menu a baixo para poder ver os comandos disponiveis. E se deseja reportar erros ou da sugestao considere acessar o [servidor de suporte](https://discord.gg/DqJSRPGjqQ)`,
            )
            .setImage('https://c.tenor.com/1NTLzvJ1yQ8AAAAC/tenor.gif')
            .setThumbnail(client.user.displayAvatarURL())
            .setFooter({ text: `${client.user.username}` })
            .setTimestamp();

        const row = new ActionRowBuilder().addComponents(selectMenu);

        await interaction.reply({ embeds: [embed], components: [row] });

        const filter = (i) =>
            i.isStringSelectMenu() && i.customId === 'category-select';
        const collector = interaction.channel.createMessageComponentCollector({
            filter,
        });

        collector.on('collect', async (i) => {
            const userInteractionId = i.user.id;

            if (userInteractionId != userId) {
                return await i.reply({
                    content: 'Use o comando /help para falar comigo.',
                    ephemeral: true,
                });
            }

            const selectedCategory = i.values[0];
            const categoryCommands = commandsByCategory[selectedCategory];

            const categoryEmbed = new EmbedBuilder()
                .setTitle(`Comandos ${selectedCategory}`)
                .setDescription(
                    'Lista todos os comandos disponiveis nesta categoria.',
                )
                .setThumbnail(`${client.user.displayAvatarURL()}`)
                .addFields(
                    categoryCommands.map((command) => ({
                        name: command.name,
                        value: command.description,
                    })),
                );

            await i.update({ embeds: [categoryEmbed] });
        });
    },
};
