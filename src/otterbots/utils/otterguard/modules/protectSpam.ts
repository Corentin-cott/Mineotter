import {Client} from "discord.js";
import {otterguard_Embed} from "../embed";

/**
 * Monitors messages in a Discord server and detects potential spam activity. If a user exceeds certain thresholds for message frequency and channel activity,
 * the method temporarily restricts the user by applying a timeout and sends a warning message privately.
 *
 * @param {Client} client - The Discord.js client instance used to monitor and manage server activities.
 * @return {Promise<void>} Resolves when the spam protection mechanism is successfully initialized.
 */
export async function otterguard_protectSpam(client: Client) {
    client.on('messageCreate', async (message) => {
        if (message.author.bot) return;

        const messageCache = new Map();
        const channelCache = new Map();
        const MESSAGES_THRESHOLD = 5;
        const CHANNELS_THRESHOLD = 3;
        const TIME_WINDOW = 5000;

        const userId = message.author.id;
        const channelId = message.channel.id;
        const currentTime = Date.now();

        if (!messageCache.has(userId)) {
            messageCache.set(userId, []);
            channelCache.set(userId, new Set());
        }

        const userMessages = messageCache.get(userId);
        const userChannels = channelCache.get(userId);

        userMessages.push(currentTime);
        userChannels.add(channelId);

        const recentMessages = userMessages.filter((timestamp: number) => currentTime - timestamp < TIME_WINDOW);
        messageCache.set(userId, recentMessages);

        if (recentMessages.length >= MESSAGES_THRESHOLD && userChannels.size >= CHANNELS_THRESHOLD) {
            try {
                const member = message.guild?.members.cache.get(userId);
                if (member) {
                    await member.timeout(60000, 'Spam detected across multiple channels');

                    try {
                        messageCache.delete(userId);
                        channelCache.delete(userId);
                    } catch {
                        return
                    }

                    // Send a message to the user with the link and the reason for the deletion
                    let titleContent, messageContent
                    if (process.env.BOT_LANGUAGE.toLowerCase() == "fr") {
                        titleContent = `Spam détecté dans plusieurs salons.`
                        messageContent = `${message.author}, un possible spam de votre part sur le serveur ${process.env.DISCORD_NAME} a été détecté, 
                        vous avez subi un timeout de 1 minute. En cas d'erreur merci de contacter un administrateur.`
                    } else {
                        titleContent = `Spam detected in multiple channels.`
                        messageContent = `${message.author}, a possible spam of your part on the server ${process.env.DISCORD_NAME} has been detected, 
                        you have been timed out for 1 minute. In case of an error please contact an administrator.`
                    }

                    // Send the message to the user
                    await message.author.send({
                        embeds: [otterguard_Embed(titleContent, messageContent)]
                    });
                }
            } catch (error) {
                console.error('Error timing out user:', error);
            }
        }
    })
}