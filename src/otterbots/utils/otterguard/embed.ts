import {EmbedBuilder} from "discord.js";

/**
 * Creates and returns an embed message object with a specified title and message content, formatted for use in applications like Discord.
 *
 * @param {string} title - The title of the embed message.
 * @param {string} messageContent - The main content or description of the embed message.
 * @return {EmbedBuilder} An instance of EmbedBuilder containing the formatted embed message.
 */
export function otterguard_Embed(title: string, messageContent: string): EmbedBuilder {
    return new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Otterguard: '+ title)
        .setDescription(messageContent)
        .setTimestamp()
        .setFooter({text: 'Otterguard'})
}