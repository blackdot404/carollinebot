const {
    ComponentType,
    EmbedBuilder,
    SlashCommandBuilder,
    ActionRowBuilder,
    SelectMenuBuilder,
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Lista todos os comandos disponivel no bot."),

    async execute(interaction) {
        const emojis = {
            info: "📋",
            mod: "🔨",
            gerenal: "⚙️",
        };

        const directories = [
            ...new Set(interaction.client.commands.map((cmd) => cmd.folder)),
        ];

        const formatString = (str) =>
            `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;

        const categories = directories.map((dir) => {
            const getCommands = interaction.client.commands
                .filter((cmd) => cmd.folder === dir)
                .map((cmd) => {
                    return {
                        name: cmd.data.name,
                        description:
                            cmd.data.description ||
                            "Esse comando não possui descrição.",
                    };
                });

            return {
                directory: formatString(dir),
                commands: getCommands,
            };
        });

        const embed = new EmbedBuilder()
            .setDescription("Por favor selecione a categoria no menu abaixo.")
            .setColor(16312092);

        const components = (state) => [
            new ActionRowBuilder().addComponents(
                new SelectMenuBuilder()
                    .setCustomId("help-menu")
                    .setPlaceholder("Por favor selecione a categoria.")
                    .setDisabled(state)
                    .setOptions(
                        categories.map((cmd) => {
                            return {
                                label: cmd.directory,
                                value: cmd.directory.toLowerCase(),
                                description: `Comandos da categoria ${cmd.directory}.`,
                                emoji: emojis[
                                    cmd.directory.toLowerCase() || null
                                ],
                            };
                        })
                    )
            ),
        ];

        const initialMessage = await interaction.reply({
            embeds: [embed],
            components: components(false),
        });

        const filter = (interaction) =>
            interaction.user.id === interaction.member.id;

        const collector = interaction.channel.createMessageComponentCollector({
            filter,
            componentType: ComponentType.SelectMenu,
        });

        collector.on("collect", (interaction) => {
            const [directory] = interaction.values;
            const category = categories.find(
                (x) => x.directory.toLowerCase() === directory
            );

            const categoryEmbed = new EmbedBuilder()
                .setTitle(`${formatString(directory)} comando`)
                .setDescription(
                    `Todos os comandos que estão presente na categoria ${directory}.`
                )
                .setColor(16312092)
                .addFields(
                    category.commands.map((cmd) => {
                        return {
                            name: `\`${cmd.name}\``,
                            value: cmd.description,
                            inline: true,
                        };
                    })
                );

            interaction.update({ embeds: [categoryEmbed] });
        });

        collector.on("end", () => {
            initialMessage.edit({ components: components(true) });
        });
    },
};
