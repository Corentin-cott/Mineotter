import { otterlogs } from "../../otterbots/utils/otterlogs";
import { rconHelper } from "../utils/rconHelpler"
import { cleanUserMessage } from "../utils/discordMessageCleaner"
import { RconConfig } from "../types/rconTypes"
import { Message } from "discord.js";

module.exports = {
    name: "messageCreate",
    once: false,
    async execute(message: Message) {
        // Ignore bots
        if (message.author.bot) return;

        const targetChannelId = ""; // TODO : Remove hardcoded ID
        const rcon: RconConfig = {
            host: "", // TODO : Remove hardcoded ID
            port: 0, // TODO : Remove hardcoded port
            password: "", // TODO : Remove hardcoded password
            timeout: 5000
        }

        if (message.channel.id === targetChannelId) {
            otterlogs.debug(`Message from ${message.author.tag}: ${message.content}`);

            // We store userMessage to clean it from custom emojis. We also add a text if the message has a file attached
            const cleanMessage = cleanUserMessage(message);

            // We construct the command with JSON.stringify to prevent any form of injection.
            const tellrawObject=["",{text:"<"},{text:message.author.username,color:"#7289DA",hoverEvent:{action:"show_text",contents:"Message provenant de Discord"}},{text:`> ${cleanMessage}`}];
            const command: string = `/tellraw @a ${JSON.stringify(tellrawObject)}`;

            // We send the command through rconHelper.sendCommand()
            const result = await rconHelper.sendCommand(rcon, command);
            if (result != null && result.length > 0) {
                otterlogs.debug(result)
            }

            /*
            TODO : Check openned servers & get all rcon parameters with Otterbots access to Otterly API.
             Then, send the message to all servers with the rcon command.
              v Prevent command injections
              v Say "Piece jointe" when a piecture, video, audio or file is sent
              v Send "🦦" when a emoji is sent
              v Send "🦦" when a animated emoji is sent
            */
        }
    }
};