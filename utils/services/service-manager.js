import { configureNewTemplate } from "../inquirer/configureNewTemplate.js";
import { generateTemplateByIdentifier } from "../getSelectedTemplate.js";
import { getAllConfiguredTemplates, showNewTemplate } from "../templates.js";
import { showUsage } from "./showUsage.js";
import { removeTemplate } from "../inquirer-common/removeTemplate.js";

export async function serviceManager(args) {
    switch (args[0]) {
        case "generate":
            if (args[1] === "-c") {
                console.log("Generating templates combined...");
                // Your code to generate combined templates
            } else if (args[1]) {
                const selectedTemplateDetails = generateTemplateByIdentifier(
                    args[1]
                );
            } else {
                console.log("Error: Template name required for generate command.");
                showUsage();
            }
            break;
        case "list":
            if (args[1] === "-c" || args[1] === "configured") {
                const allTemplates = getAllConfiguredTemplates();
                if (allTemplates.length > 0) {
                    console.log(`\nConfigured templates:\n${allTemplates}\n`);
                } else {
                    console.log("\nNo configured templates found!! 😔\n");
                }
            } else if (args[1] === "new") {
                const newTemplates = (await showNewTemplate()).join("\n");
                if (newTemplates.length > 0) {
                    console.log(`\nNew templates:\n\n${newTemplates}\n`);
                } else {
                    console.log("\nNo new templates found!! 😔\n");
                }
            }
            break;
        case "configure":
            if (args[1] === "-n") {
                await configureNewTemplate();
            }
            break;
        case "remove":
            if (args[1]) {
                await removeTemplate(args[1]);
            } else if (args.length === 1) {
                await removeTemplate();
            }
            break;

        default:
            console.log("Error: Unknown command.");
            showUsage();
            break;
    }
}
