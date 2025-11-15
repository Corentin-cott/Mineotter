import {otterlogs} from "../../otterbots/utils/otterlogs";
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
        }
    }
};