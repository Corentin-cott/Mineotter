import axios from "axios";
import fs from "fs";
import {RoutesType} from "./modules/RoutesType";
import {otterlogs} from "../otterlogs";

export class Otterlyapi {
    private readonly jsonFilePath: string;

    constructor() {
        this.jsonFilePath = 'otterlyApiRoutes.json';
    }

    /**
     * Returns the path to the JSON file containing route configurations.
     * @private
     */
    private static getJsonFilePath(): string {
        return new Otterlyapi().jsonFilePath;
    }

    /**
     * Initializes the application by registering the routes defined in a JSON file.
     * Logs a success message if the registration is successful or an error message if it fails.
     *
     * @return {Promise<void>} A promise that resolves when the initialization process completes.
     */
    public async init(): Promise<void> {

        // Register routes in the JSON file
        try {
            await this.registerRoutesInJsonFile();
            otterlogs.success("Otterlyapi: Routes registered successfully!");
        } catch (error) {
            otterlogs.error("Otterlyapi: Failed to register routes: " + error);
            return;
        }

    }

    /**
     * Registers routes in a local JSON file by fetching data from an API.
     * This method fetches route data from an API endpoint defined in the environment variables,
     * checks for the existence of the specified JSON file, and writes the fetched data to the file.
     * If the file does not exist, it creates a new JSON file with the fetched data.
     *
     * @return {Promise<boolean>} A promise that resolves to true if the operation succeeds, or false if an error occurs.
     */
    private async registerRoutesInJsonFile(): Promise<boolean> {

        const api = process.env.API_ROUTES_URL;

        try {
            const response = await axios.get(api);
            const filePath = this.jsonFilePath;
            // Create empty JSON file if it doesn't exist
            if (!fs.existsSync(filePath)) {
                fs.writeFileSync(filePath, '[]');
            }
            fs.writeFileSync(filePath, JSON.stringify(response.data, null, 2));
            return true;
        } catch (error) {
            console.error('Error fetching routes:', error);
            return false;
        }

    }

    /**
     * Fetches route information by its alias from the JSON file containing route configurations.
     * Reads and parses the JSON file, then searches for a route matching the provided alias.
     * Returns undefined if the route is not found or if there's an error reading the file.
     *
     * @param alias The alias identifier of the route to search for
     * @returns The route information (RoutesType) if found, undefined otherwise
     * @throws Logs an error if there are issues reading/parsing the JSON file
     */
    public static getRoutesInfosByAlias(alias: string): RoutesType | undefined {

        const filePath = Otterlyapi.getJsonFilePath()

        try {
            const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            const routes: RoutesType[] = Array.isArray(jsonData.data)
                ? jsonData.data
                : Array.isArray(jsonData) ? jsonData : [];

            return routes.find((route: RoutesType) => route.alias === alias);
        } catch (error) {
            otterlogs.error('Error reading routes file: ' + error);
            return undefined;
        }

    }

    /**
     * Retrieves data associated with the given alias.
     *
     * The method fetches a route corresponding to the alias from the configuration,
     * and performs an HTTP GET request to retrieve the data. If no data is found or an error occurs,
     * it returns undefined.
     *
     * @param {string} alias - The alias corresponding to the desired route.
     * @param param - Optional parameter to be appended to the route URL.
     * @return {Promise<T | undefined>} A promise that resolves to the fetched data of type `T` if successful,
     * or undefined if the alias is invalid or an error occurs.
     */
    public static async getDataByAlias<T>(alias: string, param?: string): Promise<T | undefined> {

        // Check if the alias is valid
        if (!alias) {
            otterlogs.error('Invalid alias provided for fetching data');
            return undefined;
        }

        // Fetch the route information from the JSON file
        const routeInfo = Otterlyapi.getRoutesInfosByAlias(alias);
        if (!routeInfo) {
            otterlogs.error(`No route found for alias: ${alias}`);
            return undefined;
        }

        // Perform the HTTP GET request to fetch the data
        try {
            const response = await axios.get(routeInfo.route.replace(/:\w+$/, param || ''));
            return response.data.data as T;
        } catch (error) {
            otterlogs.error(`Error fetching data for alias ${alias}: ${error}`);
            return undefined;
        }

    }

    /**
     * Sends an HTTP POST request to a route associated with the given alias and fetches the corresponding data.
     *
     * @param {string} alias - The alias used to identify the API route.
     * @param {undefined} data - The payload data to be sent in the POST request. Currently, only undefined is supported as the input.
     * @return {Promise<T | undefined>} - A promise resolving to the fetched data of type T, or undefined in case of failure or invalid input.
     */
    public static async postDataByAlias<T>(alias: string, data: T): Promise<T | undefined> {

        // Check if the alias is valid
        if (!alias) {
            otterlogs.error('Invalid alias provided for fetching data');
            return undefined;
        }

        // Fetch the route information from the JSON file
        const routeInfo = Otterlyapi.getRoutesInfosByAlias(alias);
        if (!routeInfo) {
            otterlogs.error(`No route found for alias: ${alias}`);
            return undefined;
        }

        // Check if API token is available
        if (!process.env.API_TOKEN) {
            otterlogs.error('API token is not configured');
            return undefined;
        }

        // Perform the HTTP POST request to fetch the data
        try {
            const response = await axios.post(routeInfo.route, data, {
                headers: {
                    Authorization: `${process.env.API_TOKEN}`
                },
                validateStatus: (status) => status >= 200 && status < 300
            });

            if (!response.data || !response.data.data && !response.data.success) {
                otterlogs.error(`Invalid response data structure for alias ${alias}`);
                return undefined;
            }

            return response.data.data as T;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                otterlogs.error(`HTTP error for alias ${alias}: ${error.message}${error.response?.data ? ` - ${JSON.stringify(error.response.data)}` : ''}`);
            } else {
                otterlogs.error(`Unexpected error for alias ${alias}: ${error}`);
            }
            return undefined;
        }

    }
}