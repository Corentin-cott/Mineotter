/**
 * Salon properties with name, role ID and optional type/category.
 * @property {string} name - Salon name
 * @property {string} role_id - Associated role ID
 * @property {number} [type] - Salon type
 * @property {number} [category] - Salon category
 */
export type SalonType = {
    alias: string,
    name: string,
    role_id: string,
    type?: number;
    category?: number;
    channelId?: string;
    webhook?: boolean;
}

/**
 * Represents a SalonCategory, which is typically used to map categories in a salon system.
 * @property {number} id - The unique identifier for the salon category.
 * @property {string} name - The name of the salon category.
 * @property {string} role_id - The identifier representing the role associated with the salon category.
 */
export type SalonCategory = {
    id: number
    name: string,
    role_id: string,
}