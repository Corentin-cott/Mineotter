import {
    AutocompleteInteraction,
    ButtonInteraction,
    CacheType, ChannelSelectMenuInteraction,
    ChatInputCommandInteraction,
    Collection, MentionableSelectMenuInteraction,
    MessageContextMenuCommandInteraction,
    ModalSubmitInteraction, PrimaryEntryPointCommandInteraction, RoleSelectMenuInteraction,
    SlashCommandBuilder, StringSelectMenuInteraction, UserContextMenuCommandInteraction, UserSelectMenuInteraction
} from "discord.js"

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: "dev" | "prod"
            BOT_TOKEN: string
            API_ROUTES_URL: string
            API_TOKEN: string
            BOT_LANGUAGE: "FR" | "EN"
            DISCORD_CLIENT_ID: string
            DISCORD_GUILD_ID: string
            GIT_REPOSITORY: string
            PROJECT_LOGO: string
            BOT_NAME: string
            BOT_COLOR: string
            VERSION: string

            ENABLE_DISCORD_SUCCESS: "true" | "false"
            ENABLE_DISCORD_LOGS: "true" | "false"
            ENABLE_DISCORD_WARNS: "true" | "false"
            ENABLE_DISCORD_ERRORS: "true" | "false"

            GLOBAL_WEBHOOK_URL: string
            ERROR_WEBHOOK_URL: string
        }
    }
}

declare module "discord.js" {
    export interface Client {
        slashCommands: Collection<string, SlashCommand>
    }
}

export interface SlashCommand {
    autocomplete: boolean;
    name: string,
    data: SlashCommandBuilder;
    execute: (interaction: ChatInputCommandInteraction<CacheType> | MessageContextMenuCommandInteraction<CacheType> | UserContextMenuCommandInteraction<CacheType> | PrimaryEntryPointCommandInteraction<CacheType> | StringSelectMenuInteraction<"cached" | "raw" | undefined> | UserSelectMenuInteraction<"cached" | "raw" | undefined> | RoleSelectMenuInteraction<"cached" | "raw" | undefined> | MentionableSelectMenuInteraction<"cached" | "raw" | undefined> | ChannelSelectMenuInteraction<"cached" | "raw" | undefined> | ButtonInteraction<CacheType> | AutocompleteInteraction<CacheType> | ModalSubmitInteraction<CacheType>) => Promise<void>;
}

export { }