import {Client} from "discord.js";
import {otterbots_reactions} from "../../app/config/emojiReact";
import {otterlogs} from "../utils/otterlogs";

/**
 * Initializes the event listener to automatically react to messages based on predefined conditions.
 * This function listens for the "messageCreate" event on the provided client, checks messages
 * against a set of conditions, and reacts with the corresponding emoji if the condition is met.
 *
 * @param {Client} client - The Discord client instance used to handle message events and reactions.
 * @return {Promise<void>} Resolves once the event listener is initialized.
 */
export async function otterBots_initEmoteReact(client: Client): Promise<void> {
    client.on('messageCreate', async (message) => {
        if (message.author.bot) return;

        // Parcours de la liste des conditions
        for (const { condition, emoji } of otterbots_reactions) {
            try {
                if (condition(message)) {
                    await message.react(emoji);
                }
            } catch (err) {
                otterlogs.error(`Impossible de réagir avec ${emoji}: `+ err);
            }
        }
    })
}