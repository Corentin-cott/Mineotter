import {ActivityType, Client} from "discord.js";

/**
 * Updates the bot's activity status based on the provided activity type and activity name.
 * Available activity types:
 * - "playing": Shows as "Playing {activity}"
 * - "streaming": Shows as "Streaming {activity}"
 * - "listening": Shows as "Listening to {activity}"
 * - "watching": Shows as "Watching {activity}"
 * - "competing": Shows as "Competing in {activity}"
 *
 * @param {string} activityType - The type of activity to set (e.g., "playing", "streaming", "listening", etc.).
 * @param {string} activity - The name or description of the activity to display.
 * @param {Client} client - The client instance representing the bot.
 * @return {void} This function does not return a value.
 */
export function otterBots_setActivity(activityType: string, activity: string, client: Client): void {
    client.on('clientReady', () => {
        let type = ActivityType.Playing;
        switch (activityType.toLowerCase()) {
            case "playing":
                type = ActivityType.Playing;
                break;
            case "streaming":
                type = ActivityType.Streaming;
                break;
            case "listening":
                type = ActivityType.Listening;
                break;
            case "watching":
                type = ActivityType.Watching;
                break;
            case "competing":
                type = ActivityType.Competing;
                break;
        }

        client?.user?.setActivity({
            type: type,
            name: activity,
            state: activity,
        });
    })
}