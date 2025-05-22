import inquirer from "inquirer";
import { listAllConfiguredTemplates } from "../templates.js";
import { configureNewTemplate } from "./configureNewTemplate.js";
import { removeTemplate } from "../inquirer-common/removeTemplate.js";

export const performConfiguration = async (configureTemplateChoice) => {
    if (configureTemplateChoice === "configure new template") {
        await configureNewTemplate();
    } else if (configureTemplateChoice === "remove template") {
        await removeTemplate();
    } else if (configureTemplateChoice === "modify existing template") {
        /* To edit details of configured templates */
        let allTemplates = listAllConfiguredTemplates();
        if (allTemplates.length === 0) {
            console.log("\nNo templates found!! 😔\n");
            process.exit(0);
        }
        const allTemplatesName = allTemplates.map((item) => item.templateName);
        const selectedTemplateDetails = await inquirer
            .prompt([
                {
                    type: "list",
                    name: "selectedTemplateName",
                    message: "select template to modify",
                    choices: allTemplatesName,
                },
            ])
            .then(({ selectedTemplateName }) => {
                const index = allTemplates.findIndex((item) => item.templateName === selectedTemplateName);
                return {
                    index,
                    templateDetails: allTemplates[index],
                };
            });

        return selectedTemplateDetails;
    }
};
