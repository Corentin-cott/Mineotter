import {otterlogs} from "../otterlogs";
import {Client} from "discord.js";
import {otterguard_protectLink} from "./modules/protectLink";
import {otterguardConfig} from "../../../app/config/otterguardConfig";
import {otterguard_protectScam} from "./modules/protectScam";
import {otterguard_protectSpam} from "./modules/protectSpam";

/**
 * Initializes and configures the Otterguard protection mechanisms for the client.
 *
 * @param {Client} client - The client instance that Otterguard is managing.
 * @return {Promise<void>} A promise that resolves once Otterguard has been successfully initialized and, if enabled, link protection has been configured.
 */
export function otterbots_otterguard(client: Client): void {
    otterlogs.success("Otterguard is working!")
    if (otterguardConfig.protectLink) {
        otterguard_protectLink(client)
        otterlogs.debug("Otterguard: Link protection is enabled!")
    }
    if (otterguardConfig.protectScam) {
        otterguard_protectScam(client)
        otterlogs.debug("Otterguard: Scam protection is enabled!")
    }
    if (otterguardConfig.protectSpam) {
        otterguard_protectSpam(client)
        otterlogs.debug("Otterguard: Spam protection is enabled!")
    }

}