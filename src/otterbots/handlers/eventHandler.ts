import path from "path";
import fs from "fs";
import { pathToFileURL } from "url";
import { Client } from "discord.js";
import {otterlogs} from "../utils/otterlogs";

export async function otterbots_eventHandler(client: Client) {
    const eventsPath = path.join(__dirname, '../../app/events');
    const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.js'));

    try {
        for (const file of eventFiles) {
            const filePath = path.join(eventsPath, file);
            const fileUrl = pathToFileURL(filePath).href;

            try {
                const event = await import(fileUrl);
                const evt = event.default ?? event;

                if (evt.once) {
                    client.once(evt.name, (...args) => evt.execute(...args));
                } else {
                    client.on(evt.name, (...args) => evt.execute(...args));
                }
            } catch (error) {
                otterlogs.error(`Error loading event ${file}:` + error);
            }
        }
        otterlogs.success(`${eventFiles.length} events successfully loaded!`);
    } catch (error) {
        otterlogs.error('Error loading events:' + error);
    }
}