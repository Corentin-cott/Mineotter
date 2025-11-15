import { WebhookClient } from "discord.js";
import pino from "pino";
import dotenv from "dotenv";

dotenv.config();

/**
 * A variable that handles the translation of time from one format, timezone, or representation to another.
 * It may be used to convert time strings to different locales, adjust timezones, or reformat time for display purposes.
 */
let translateTime
if (process.env.NODE_ENV == "dev") {
    translateTime = "SYS:HH:MM:ss"
} else {
    translateTime = "SYS:dd-mm-yyyy HH:MM:ss"
}

/**
 * Function to add a type field to the log object if the environment is set to development.
 * @param type
 */
function typeLogger(type: string): { type?: string } {
    if (process.env.NODE_ENV === "dev") {
        return { type };
    }
    return {};
}

/**
 * Logger instance configured using the Pino logging library.
 *
 * The logger is set up with a default log level of "info", which can be overridden
 * by setting the environment variable LOG_LEVEL. It uses the 'pino-pretty' transport
 * for log formatting, enabling colorized output and custom timestamp formatting.
 * Specific fields such as "pid" and "hostname" are excluded from the log output.
 */
const logger = pino({
    level: process.env.LOG_LEVEL || "info",
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: translateTime,
            ignore: "pid,hostname",
        },
    }
})

/**
 * Log functions with different styling and Discord webhook integration
 * @property success - Green [success] prefix + Discord webhook
 * @property log - Blue [info] prefix + Discord webhook
 * @property warn - Yellow [warn] prefix + Discord webhook
 * @property error - Red [error] prefix + Discord error webhook
 * @property important - Yellow text + Discord webhook
 * @property silentlog - Plain console log only
 */
export const otterlogs = {
    success: (message: string): void => {
        logger.info(typeLogger("success"), message);
        sendLogMessage(message, false, "success");
    },
    log: (message: string): void => {
        logger.info(typeLogger("log"), message);
        sendLogMessage(message, false, "log");
    },
    warn: (message: string): void => {
        logger.warn(typeLogger("warn"), message);
        sendLogMessage(message, false, "warn");
    },
    error: (message: string): void => {
        logger.error(typeLogger("error"), message);
        sendLogMessage(message, true, "error");
    },
    important: (message: string): void => {
        logger.info(typeLogger("important"), message);
        sendLogMessage(message, false, "important");
    },
    debug: (message: string): void => {
        if (process.env.NODE_ENV === "dev") {
            logger.info(typeLogger("debug"), message);
        }
    },
    silentlog: (message: string): void => {
        logger.debug(message);
    }
};

/**
 * Sends a log message to Discord using webhooks based on the message type
 * @param message The message content to send
 * @param error Whether to use the error webhook URL instead of the global one
 * @param type The type of log message (success, log, warn, error, important)
 */
function sendLogMessage(message: string, error: boolean, type?: string): void {
    if (process.env.ENABLE_DISCORD_SUCCESS === "false" && type === "success") return;
    if (process.env.ENABLE_DISCORD_LOGS === "false" && type === "log") return;
    if (process.env.ENABLE_DISCORD_WARNS === "false" && type === "warn") return;
    if (process.env.ENABLE_DISCORD_ERRORS === "false" && type === "error") return;

    const webhookURL = error ? process.env.ERROR_WEBHOOK_URL : process.env.GLOBAL_WEBHOOK_URL;

    if (!webhookURL) {
        otterlogs.error("Webhook URL non définie dans le fichier .env !");
        return;
    }

    const webhookClient = new WebhookClient({ url: webhookURL });

    webhookClient.send({
        content: message,
        username: `${process.env.BOT_NAME} - ${type?.toUpperCase()}`,
    }).catch((err) => {
        otterlogs.error("Erreur lors de l'envoi du message via webhook:" + err);
    });
}