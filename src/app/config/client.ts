import {Client, GatewayIntentBits } from "discord.js";

/** Creates a Client instance with preset intents for guilds, messages, reactions, content, members, and voice states.
 * @return {Client<boolean>} A configured instance of the Discord Client.
 */
export const clientGatewayIntent = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
    ]
})

