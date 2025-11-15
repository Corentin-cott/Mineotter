import { otterlogs } from "../../otterbots/utils/otterlogs";
import { Message } from "discord.js";

module.exports = {
    name: "messageCreate",
    once: false,
    execute(message: Message) {
        // Ignore bots
        if (message.author.bot) return;

        const targetChannelId = ""; // TODO : Remove hardcoded ID

        if (message.channel.id === targetChannelId) {
            otterlogs.log(`Message from ${message.author.tag}: ${message.content}`);

            /*
            TODO : Check openned servers & get all rcon parameters with Otterbots access to Otterly API.
             Then, send the message to all servers with the rcon command.
              - Prevent command injections
              - Say "Piece jointe" when a piecture, video, audio or file is sent
              - Send "🦦" when a emoji is sent
              - Send "🦦" when a animated emoji is sent


            */
        }
    }
};