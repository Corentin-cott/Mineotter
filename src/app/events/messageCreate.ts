import { otterlogs } from "../../otterbots/utils/otterlogs";
import { Otterlyapi } from "../../otterbots/utils/otterlyapi/otterlyapi";
import { rconHelper } from "../utils/rconHelpler";
import { cleanUserMessage } from "../utils/discordMessageCleaner";
import { RconConfig } from "../types/rconTypes";
import { Message } from "discord.js";

// Interface defining the structure of the API response
interface ServerData {
    id: number;
    serveurs_id: number;
    host: string;
    rcon_host: string;
    rcon_port: string; // The API returns this as a string "25575"
    rcon_password: string;
}

interface ApiResponse {
    success: boolean;
    data: ServerData[];
}

module.exports = {
    name: "messageCreate",
    once: false,
    async execute(message: Message) {
        // Ignore bots
        if (message.author.bot) return;

        const targetChannelId = ""; // TODO : Remove hardcoded ID

        if (message.channel.id === targetChannelId) {
            otterlogs.debug(`Message from ${message.author.tag}: ${message.content}`);

            // Construction of the tellraw command
            const cleanMessage = cleanUserMessage(message);
            const tellrawObject=["",{text:"<"},{text:message.author.username,color:"#7289DA",hoverEvent:{action:"show_text",contents:"Message provenant de Discord"}},{text:`> ${cleanMessage}`}];

            // JSON.stringify ensures safe escaping of special characters
            const command: string = `/tellraw @a ${JSON.stringify(tellrawObject)}`;

            try {
                // GET request to the API
                const response = await Otterlyapi.getDataByAlias<ApiResponse>('otr-serveurs-primaire-secondaire');

                if (response.data && response.success && Array.isArray(response.data)) {
                    const servers = response.data;

                    // We use Promise.all to send requests to all servers in parallel
                    await Promise.all(servers.map(async (server) => {
                        const rcon: RconConfig = {
                            host: server.rcon_host,
                            port: parseInt(server.rcon_port), // Convert port to number as API sends string "25575" but Rcon usually expects number
                            password: server.rcon_password,
                            timeout: 5000
                        };

                        try {
                            const result = await rconHelper.sendCommand(rcon, command);
                            if (result != null && result.length > 0) {
                                otterlogs.debug(`[${server.host}] RCON Response: ${result}`);
                            }
                        } catch (rconError) {
                            otterlogs.error(`[${server.host}] RCON Failed: ${rconError}`);
                        }
                    }));
                }
            } catch (error) {
                otterlogs.error(`Failed to fetch servers or send messages: ${error}`);
            }
        }
    }
};