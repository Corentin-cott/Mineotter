import {Client, Colors, Guild, PermissionFlagsBits, ChannelType} from "discord.js";
import {otterlogs} from "./otterlogs";
import {botSalon, salonCategory} from "../../app/config/salon";
import fs from "fs";

/**
 * Represents a salon with its associated details in a JSON structure.
 *
 * The `JsonSalonType` is structured to encapsulate information about a salon,
 * including its name, category name, unique identifier, and webhook URL for integrations.
 *
 * Properties:
 * - `name`: The name of the salon.
 * - `categoryName`: The category or classification of the salon (e.g., spa, hair salon).
 * - `id`: A unique identifier for the salon.
 * - `webhook`: The URL of the webhook used for sending or receiving salon data.
 */
type JsonSalonType = {
    name: string;
    categoryName: string;
    id: string;
    webhook: string;
}

/**
 * Creates Discord text channels within specific categories for a guild. Ensures that categories and channels are created only if they do not already exist, and manages permissions for a specific role.
 *
 * @param {Client} client The Discord bot client instance used to interact with the Discord API and execute guild-related operations.
 * @return {Promise<void>} A promise that resolves once the channels and roles are created or the operation concludes. If an error occurs, it logs the error and does not throw it further.
 */
export async function otterBots_initSalon(client: Client): Promise<void> {
    client.on('clientReady', async (): Promise<void> => {
        try {
            const channelNames: JsonSalonType[] = [];
            // Names of channels to create
            for (const category of salonCategory) {
                for (const salon of botSalon) {
                    if (salon.category === category.id && !channelNames.some(c => c.name === salon.name)) {
                        channelNames.push({id: "", webhook: "", name: salon.name, categoryName: category.name});
                    }
                }
            }

            // Server ID
            const guildId = process.env.DISCORD_GUILD_ID;
            if (!guildId) {
                otterlogs.error("❌ GuildId not found");
                return;
            }

            // Array to store existing channel names
            const channelsDiscord: string[] = [];

            try {
                // Get the guild
                const guild: Guild | undefined = client.guilds.cache.get(guildId);
                if (!guild) {
                    otterlogs.error(`❌ Guild not found (ID: ${guildId})`);
                    return;
                }

                // Get list of channels and store names in array
                guild.channels.cache.forEach((channel) => {
                    channelsDiscord.push(channel.name);
                });

                // Check if role already exists
                let role = guild.roles.cache.find((r) => r.name === process.env.BOT_NAME);
                if (!role) {
                    // Create specific role
                    role = await guild.roles.create({
                        name: process.env.BOT_NAME,
                        color: Colors.Blue,
                        reason: "Specific role for category",
                    });
                }

                // For each category
                for (const category of salonCategory) {
                    // Check if category already exists
                    let categoryChannel = guild.channels.cache.find(
                        (channel) =>
                            channel.name === category.name &&
                            channel.type === 4
                    );

                    // If not, create it
                    if (!categoryChannel) {
                        // Creates a category with permissions for the specific role
                        categoryChannel = await guild.channels.create({
                            name: category.name,
                            type: ChannelType.GuildCategory,
                            permissionOverwrites: [
                                {
                                    id: guild.id,
                                    deny: [PermissionFlagsBits.ViewChannel],
                                },
                                {
                                    id: role.id,
                                    allow: [PermissionFlagsBits.ViewChannel],
                                },
                            ],
                        });
                        otterlogs.success(`Category "${category.name}" created with permissions!`);
                    }

                    // Creates channels in this category
                    for (const salon of botSalon) {
                        if (!channelsDiscord.includes(salon.name)) {
                            const newChannel = await guild.channels.create({
                                name: salon.name,
                                type: ChannelType.GuildText,
                                parent: categoryChannel.id,
                                permissionOverwrites: [
                                    {
                                        id: guild.id,
                                        deny: [PermissionFlagsBits.ViewChannel],
                                    },
                                    {
                                        id: role.id,
                                        allow: [PermissionFlagsBits.ViewChannel],
                                    },
                                ],
                            });
                            salon.channelId = newChannel.id;
                            otterlogs.success(`Channel "${salon.name}" created with ID: ${newChannel.id}!`);

                            // Ensure channels.json exists
                            await createDefaultJson()

                            // Create a webhook if enabled
                            let webhookUrl = "";
                            if (salon.webhook === true) {
                                const webhook = await newChannel.createWebhook({
                                    name: `${process.env.BOT_NAME} - Webhook`,
                                    avatar: client.user?.displayAvatarURL() || "",

                                });
                                webhookUrl = webhook.url;
                            }

                            // Update channels.json with new channel info
                            const channelData = {...JSON.parse(fs.readFileSync('channels.json', 'utf8')),
                                [salon.alias]: {name: salon.name, id: newChannel.id, webhook: webhookUrl}
                            };

                            // Write updated data back to channels.json
                            fs.writeFileSync('channels.json', JSON.stringify(channelData, null, 2));
                            otterlogs.debug("Channels updated in channels.json");
                        }
                    }
                }
            } catch (error) {
                otterlogs.error(`Error while creating channels: ${error}`);
            }
        } catch (error) {
            otterlogs.error(`Unable to execute OnReady event: ${error}`);
        }
    });
}

/**
 * Retrieves the salon ID from channels.json using a given alias.
 * Returns empty string if alias not found or error reading file.
 *
 * @param {string} alias - The alias identifier of the salon to look up
 * @return {Promise<string>} The channel ID if found, empty string otherwise
 */
export function getSalonByAlias(alias: string): JsonSalonType | void {
    try {
        const channels = JSON.parse(fs.readFileSync('channels.json', 'utf8'));
        if (channels[alias] && channels[alias].id) {
            return channels[alias];
        }
        otterlogs.error(`Salon with alias "${alias}" not found in channels.json`);
        return;
    } catch (error) {
        otterlogs.error(`Error reading channel ID: ${error}`);
        return;
    }
}

/**
 * Creates a default channels.json file if it doesn't exist.
 * If the file exists, it reads and parses the existing channels.
 * In case of an error, it attempts to create the file again.
 */
async function createDefaultJson(): Promise<void> {
    try {
        if (!fs.existsSync('channels.json')) {
            fs.writeFileSync('channels.json', JSON.stringify({}, null, 2), 'utf8');
            otterlogs.debug('Channels file `channels.json` created by default');
        }
    } catch (error) {
        otterlogs.error(`Error ensuring channels.json: ${error}`);
        try {
            if (!fs.existsSync('channels.json')) {
                fs.writeFileSync('channels.json', JSON.stringify({}, null, 2), 'utf8');
                otterlogs.debug('Channels file `channels.json` created after error');
            }
        } catch (err) {
            otterlogs.error(`Unable to create channels.json: ${err}`);
        }
    }
}