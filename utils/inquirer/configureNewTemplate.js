import inquirer from "inquirer";
import { chooseDir } from "../chooseDir.js";
import { bindNewTemplate, showNewTemplate } from "../templates.js";
import { askRecursive } from "../askRecursive.js";

export async function configureNewTemplate() {
    const newTemplates = await showNewTemplate();
    if (newTemplates.length === 0) {
        console.log("\n No new templates found!!\n");
    } else {
        const bindTemplateChoice = await inquirer
            .prompt([
                {
                    type: "list",
                    name: "templateLocation",
                    message: "Select a template to bind",
                    choices: newTemplates
                },
                {
                    type: "input",
                    name: "templateName",
                    message: "Enter a name for the template"
                },
                {
                    type: "confirm",
                    name: "confirmStartingDir",
                    message: `Do you want to set starting directory for this template.`,
                    default: true
                }
            ])
            .then((answer) => answer);

        if (bindTemplateChoice.confirmStartingDir) {
            bindTemplateChoice.startingDir = await chooseDir();
        } else {
            bindTemplateChoice.startingDir = "./";
        }
        bindTemplateChoice.vars = await askRecursive(
            "Enter the variables that will be required while generating template :",
            "variables"
        );

        bindNewTemplate(bindTemplateChoice);
        console.log(
            `\n${bindTemplateChoice.templateName}  Template added successfully!! \n`
        );
    }
}
