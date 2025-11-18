import { Message } from 'discord.js';

export function cleanUserMessage(message: Message): string {
    // Discord raw custom emojis format: <:name:id> or <a:name:id> (for animated)
    const customEmojiRegex = /<a?:.+?:\d+>/g;
    const channelRegex = /<#(\d+)>/g;
    const roleRegex = /<@&(\d+)>/g;

    // We replace the emoji with an empty string and .trim() to remove extra whitespace. We also replace channels and roles ping
    let userMessage = message.content
        .replace(customEmojiRegex, '🦦').trim()
        .replace(channelRegex, (match, id) => {
                const channel = message.guild?.channels.cache.get(id);
                return channel ? `#${channel.name}` : match;
        })
        .replace(roleRegex, (match, id) => {
            const role = message.guild?.roles.cache.get(id);
            return role ? `@${role.name}` : match;
        })
        .trim();

    // We check if the attachments collection has any items
    if (message.attachments.size > 0) {
        if (userMessage.length > 0) {
            userMessage += ' '; // We put a space in case there's text before
        }
        userMessage += '[Fichier attaché]';
    }

    return userMessage;
}