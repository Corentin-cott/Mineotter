import {AutocompleteInteraction, ChatInputCommandInteraction, Client} from "discord.js";
import {otterlogs} from "../utils/otterlogs";
import {SlashCommand} from "../types";

/**
 * Handles interaction events for chat input commands and executes the appropriate command logic.
 *
 * @param {Client} client - The Discord.js client instance used to handle events and manage interactions.
 * @return {void} This function does not return a value; it sets up event listeners for the client.
 */
export async function otterBots_interactionCreate(client: Client): Promise<void> {
    client.on("interactionCreate", async (interaction) => {

        if (interaction.isAutocomplete()) {
            const command: SlashCommand | undefined = client.slashCommands.get(interaction.commandName);
            if (!command || typeof command.autocomplete !== "function") {
                otterlogs.warn(`No autocomplete handler for ${interaction.commandName}`);
                return;
            }

            try {
                await (command.autocomplete as (i: AutocompleteInteraction) => Promise<unknown>)(interaction as AutocompleteInteraction);
            } catch (error) {
                otterlogs.error(`Error during autocomplete for ${interaction.commandName}: ${error}`);
                try {
                    await interaction.respond([
                        { name: "⚠️ Erreur lors de l’autocomplétion", value: "error" },
                    ]);
                } catch {}
            }
            return;
        }

        if (!interaction.isChatInputCommand()) return;

        const command: SlashCommand | undefined = client.slashCommands.get(interaction.commandName);
        if (!command) {
            otterlogs.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction as ChatInputCommandInteraction);
        } catch (error) {
            otterlogs.error(`Error executing command ${interaction.commandName}: ${error}`);

            const replyMessage = interaction.replied || interaction.deferred
                ? '🦦 Oups! Une loutre a fait tomber le serveur dans l’eau! La commande n’a pas pu être exécutée.'
                : '🦦 La loutre responsable de cette commande est partie faire la sieste! Réessayez plus tard.';

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: replyMessage, ephemeral: true });
            } else {
                await interaction.reply({ content: replyMessage, ephemeral: true });
            }
        }
    });
}
