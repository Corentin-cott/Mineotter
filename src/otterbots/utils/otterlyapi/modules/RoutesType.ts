/**
 * Defines the structure for a route configuration used in an application.
 * This type specifies the essential and optional properties to handle API or
 * routing definitions, including metadata and potential developer comments.
 */
export type RoutesType = {
    id?: number;
    alias: string;
    route: string;
    method: string;
    parameters: string;
    description?: string;
    comment?: string;
}