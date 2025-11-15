import figlet from "figlet";

/**
 * Displays a stylized ASCII art logo of the given name using the 'figlet' library,
 * along with a branding message in the console.
 *
 * @param {string} [name="Otterbots"] The name to be displayed in ASCII art. Defaults to "Otterbots".
 * @return {void} This function does not return a value.
 */
export function displayLogo(name: string = "Otterbots"): void {
    console.log(
        figlet.textSync(name, {
            font: "Standard", // ou "Slant", "Big", "Ghost", etc.
            horizontalLayout: "default",
            verticalLayout: "default"
        })
    );
    console.log("✨  Made with 🦦 Otterbots 🦦 by Antre des Loutres ✨ \n");
}

