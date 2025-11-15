import {ChatInputCommandInteraction, ColorResolvable, EmbedBuilder, SlashCommandBuilder} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("git-repo")
        .setDescription("Obtiens le lien du dépôt GitHub du bot."),
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        // Récupération de BOT_COLOR et VERSION depuis .env
        const bot_color = process.env.BOT_COLOR || "#FFFFFF";
        const version = process.env.VERSION || "0.0.0";
        const name = process.env.BOT_NAME || "Otterbots";
        const git_repo = process.env.GIT_REPOSITORY || "https://github.com/AntreDesLoutres/Otterbots";
        const projectLogo = process.env.PROJECT_LOGO || "https://raw.githubusercontent.com/L-Antre-des-Loutres/Webisoutre/refs/heads/main/public/img/logo/adl-logo.png";

        const embed = new EmbedBuilder()
            .setTitle(`Dépôt GitHub de ${name}`)
            .setURL(git_repo)
            .setDescription(`Et voilà pour toi le lien de mon magnifique dépôt GitHub !\nJe suis actuellement en version ${version}.`)
            .setColor(bot_color as ColorResolvable)
            .setImage(projectLogo)
            .setFooter({
                text: name,
                iconURL: interaction.client.user?.displayAvatarURL() || '',
            })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};