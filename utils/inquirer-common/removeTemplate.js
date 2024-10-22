import inquirer from "inquirer";
import { listAllConfiguredTemplates } from "../templates.js";
import { getWizardConfigObject, updateWizardConfig } from "../wizard.js";

export const removeTemplate = async (selectedTemplateName = false) => {
    let allTemplates = listAllConfiguredTemplates();
    if (!selectedTemplateName) {
        const allTemplatesName = allTemplates.map((item) => item.templateName);
        selectedTemplateName = await inquirer
            .prompt([
                {
                    type: "list",
                    name: "selectedTemplateName",
                    message: "Which template you want to remove?",
                    choices: allTemplatesName
                }
            ])
            .then(({ selectedTemplateName }) => selectedTemplateName);
    }

    const newTemplates = allTemplates.filter(
        (item) => item.templateName !== selectedTemplateName
    );
    console.log("newTemplates: ", newTemplates);
    const wizardConfigObject = getWizardConfigObject();
    wizardConfigObject.templates = newTemplates;
    updateWizardConfig(wizardConfigObject);
};
