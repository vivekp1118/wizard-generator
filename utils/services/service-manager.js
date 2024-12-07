import { configureNewTemplate } from "../inquirer/configureNewTemplate.js";
import { generateTemplateByIdentifier } from "../getSelectedTemplate.js";
import { getAllConfiguredTemplates, showNewTemplate } from "../templates.js";
import { showUsage } from "./showUsage.js";
import { removeTemplate } from "../inquirer-common/removeTemplate.js";

export async function serviceManager(args) {
    try {
        switch (args[0]) {
            case "generate":
                if (args[1] === "-c") {
                    console.log("Generating templates combined...");
                    // Your code to generate combined templates
                    // TODO : Generate Combined Template
                } else if (args[1]) {
                    try {
                        const selectedTemplateDetails = await generateTemplateByIdentifier(args[1]);
                    } catch (error) {
                        console.error(`Error generating template: ${error.message}`);
                    }
                } else {
                    console.log("Error: Template name required for generate command.");
                    showUsage();
                }
                break;

            case "list":
                if (args[1] === "-c" || args[1] === "configured") {
                    try {
                        const allTemplates = getAllConfiguredTemplates();
                        if (allTemplates.length > 0) console.log(`\nConfigured templates:\n${allTemplates}\n`);
                        else console.log("\nNo configured templates found!! 😔\n");
                    } catch (error) {
                        console.error(`Error retrieving configured templates: ${error.message}`);
                    }
                } else if (args[1] === "new") {
                    try {
                        const newTemplates = (await showNewTemplate()).join("\n");
                        if (newTemplates.length > 0) console.log(`\nNew templates:\n\n${newTemplates}\n`);
                        else console.log("\nNo new templates found!! 😔\n");
                    } catch (error) {
                        console.error(`Error retrieving new templates: ${error.message}`);
                    }
                }
                break;

            case "configure":
                if (args[1] === "-n") {
                    try {
                        await configureNewTemplate();
                    } catch (error) {
                        console.error(`Error configuring new template: ${error.message}`);
                    }
                }
                break;

            case "remove":
                try {
                    if (args[1]) await removeTemplate(args[1]);
                    else if (args.length === 1) await removeTemplate();
                } catch (error) {
                    console.error(`Error removing template: ${error.message}`);
                }
                break;

            default:
                console.log("Error: Unknown command.");
                showUsage();
                break;
        }
    } catch (error) {
        console.error(`Unexpected error: ${error.message}`);
        showUsage();
    }
}
