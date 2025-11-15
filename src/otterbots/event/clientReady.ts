import {Client} from "discord.js";
import {otterlogs} from "../utils/otterlogs";

/**
 * This method sets up an event listener for the 'clientReady' event on the provided client instance
 * and logs a success message when the bot is ready.
 *
 * @param {Client} client - The client instance representing the bot.
 * @return {Promise<void>} A promise that resolves when the listener is successfully set up.
 */
export async function otterBots_clientReady(client: Client) : Promise<void> {
    client.on('clientReady', () => {
        const now = new Date()
        otterlogs.success(`Bot is ready at ${now.toLocaleString()} for ${client.user?.tag}!`)
        otterlogs.debug("Bot is actually in dev mode (to switch to production mode, change NODE_ENV in .env file)")
    })
}