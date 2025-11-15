import {Client} from "discord.js";
import {otterguard_Embed} from "../embed";

/**
 * Monitors and removes potentially malicious or scam messages within a Discord server.
 * Alerts the message sender when a suspicious message is detected and deleted.
 *
 * @param {Client} client - The Discord client instance, used to listen for incoming messages and take actions accordingly.
 * @return {void} This function does not return any value.
 */
export async function otterguard_protectScam(client: Client) {
    client.on('messageCreate', async (message) => {
        if (message.author.bot) return;

        /**
         * An array of regular expression patterns used to detect potential scam content.
         *
         * Each regular expression is designed to match common scam-related phrases or suspicious URLs found
         * in messages. These patterns target various forms of scams, including fake giveaways, fraudulent links,
         * and deceptive offers related to services like Discord Nitro, Steam, and more.
         *
         * Patterns included:
         * - Detection of phrases such as "nitro free", "steam gift", "discord nitro free".
         * - Identification of the word "giveaway" or variations like "give away".
         * - URLs that do not belong to trusted domains such as discord.com, youtube.com, twitch.tv, etc.
         */
        const scamPatterns = [
            /nitro\s*(?:free|gratuit|gift)/i,
            /steam\s*(?:free|gratuit|gift)/i,
            /discord\s*(?:nitro|gift|gratuit|free)/i,
            /free\s*(?:nitro|steam|gift)/i,
            /\b(?:give\s*away|giveaway)\b/i,
            /\b(?:http|https):\/\/(?!discord\.(?:com|gg)|youtube\.com|youtu\.be|twitch\.tv|tenor\.com|cdn\.discordapp\.com)[\w\-]+\.\w+/i
        ];

        const content = message.content.toLowerCase();
        let isScam = false;

        // Check if any of the patterns match the message content
        for (const pattern of scamPatterns) {
            if (pattern.test(content)) {
                isScam = true;
                break;
            }
        }

        if (isScam) {
            try {
                try {
                    await message.delete();
                } catch {
                    return;
                }

                let titleContent, messageContent
                if (process.env.BOT_LANGUAGE.toLowerCase() == "fr") {
                    titleContent = `Arnaque potentielle détectée !`
                    messageContent = `${message.author}, votre message a été supprimé car il a été détecté comme potentiellement malveillant.`
                } else {
                    titleContent = `Potential scam detected!`
                    messageContent = `${message.author}, your message has been deleted as it was detected as potentially malicious.`
                }

                // Send the message to the user
                await message.author.send({
                    embeds: [otterguard_Embed(titleContent, messageContent)]
                });

            } catch (error) {
                console.error('Error handling potential scam:', error);
            }
        }
    })
}