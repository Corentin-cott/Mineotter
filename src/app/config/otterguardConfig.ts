/**
 * Represents the configuration settings for the Otterguard system.
 * This configuration determines specific protective behaviors.
 *
 * @type {Object<boolean>}
 * @property {boolean} protectLink - Indicates whether link protection is enabled or disabled.
 */
export const otterguardConfig: { [key: string]: boolean } = {
    protectLink: true,
    protectScam: true,
    protectSpam: true,
};

/**
 * List of authorized domains for link protection.
 */
export const authorizedDomains: string[] = [
    "https://discord.com",
    "https://discord.gg",
    "https://youtube.com",
    "https://www.youtube.com",
    "https://www.twitch.tv",
    "https://twitch.tv",
    "https://pokekalos.fr",
    "https://www.pokekalos.fr",
    "https://antredesloutres.fr",
    "https://hoyo.link",
    "https://sg-public-api.hoyoverse.com",
    "https://keqingmains.com",
    "https://akasha.cv",
    "https://x.com",
    "https://youtu.be",
    "https://tenor.com/",
    "https://cdn.discordapp.com",
    "https://minecraft.fr",
    "https://www.minecraft.fr",
    "https://www.minecraft.net",
    "https://minecraft.net",
    "https://tracker.gg",
    "https://www.tracker.gg",
    "https://www.pokebip.com",
    "https://pokebip.com",
    "https://store.steampowered.com",
    "https://genshin.hoyoverse.com"
];