import {Client} from "discord.js";
import {otterlogs} from "../utils/otterlogs";

/**
 * Handles the deletion of both guild-specific and global commands for the bot.
 * This method listens to the 'clientReady' event and deletes all commands found in all guilds
 * and any global commands associated with the bot application.
 *
 * @param {Client} client - The Discord client object used to interact with the Discord API.
 * @return {Promise<void>} A promise that resolves when all commands have been successfully purged,
 * or logs an error if an issue occurs during the process.
 */
export async function otterbots_purgeCommand(client: Client): Promise<void> {
    client.on('clientReady', async () => {
        try {
            const guilds = await client.guilds.fetch();

            for (const guild of guilds.values()) {
                const guildObj = await guild.fetch();
                const commands = await guildObj.commands.fetch();

                for (const command of commands.values()) {
                    await command.delete();
                }
            }

            const globalCommands = await client.application?.commands.fetch();
            if (globalCommands) {
                for (const command of globalCommands.values()) {
                    await command.delete();
                }
            }
        } catch (error) {
            otterlogs.error('Erreur lors de la suppression des commandes :' + error);
        }

    });
}