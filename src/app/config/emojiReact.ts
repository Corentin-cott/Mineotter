import {Message} from "discord.js";

/**
 * Emoji reaction config list.
 * Defines message conditions and their corresponding emojis.
 * @type {Array<{condition: (msg: Message) => boolean, emoji: string}>}
 */
export const otterbots_reactions: Array<{ condition: (msg: Message) => boolean; emoji: string; }> = [
    {
        condition: (msg: Message) => {
            // Condition to check if the message contains "otter" or "loutre"
            const content = msg.content.toLowerCase();
            return content.includes("otter") || content.includes("loutre");
        },
        // Emoji to react with when the condition is met
        emoji: "🦦"
    },
];