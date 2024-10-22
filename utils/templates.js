import fs from "fs";
import {
    generateTemplateCode,
    updateWizardConfig,
    getWizardConfigObject
} from "./wizard.js";
/**
 * showNewTemplate - show new templates which are added to templates directory
 * but not configured in wizard.json
 * @returns list of new templates
 */

export const getAllConfiguredTemplates = () => {
    const wizardConfigObject = getWizardConfigObject();
    const templates = wizardConfigObject.templates;
    return templates.length ? templates : [];
};

export const showNewTemplate = async () => {
    const allConfiguredTemplatesPath = getAllConfiguredTemplates()?.map(
        (item) => item.templateLocation
    );
    const allTemplates = fs.readdirSync("./templates");
    const newTemplates = allTemplates.filter(
        (template) => !allConfiguredTemplatesPath.includes(template)
    );
    if (newTemplates.length === 0) {
        console.log("\n No new templates found!! 😔\n");
        process.exit();
    }
    return newTemplates;
};

export const bindNewTemplate = async (templateSetupChoices) => {
    const { templateName, templateLocation, startingDir, vars } =
        templateSetupChoices;

    const isDir = fs.statSync(`./templates/${templateLocation}`).isDirectory();

    const wizardConfigObject = getWizardConfigObject();
    wizardConfigObject.templates.push({
        templateName,
        templateLocation,
        startingDir,
        vars,
        templateCode: generateTemplateCode(templateName),
        type: isDir ? "D" : "F"
    });

    updateWizardConfig(wizardConfigObject);
};

export const listAllConfiguredTemplates = () => {
    const wizardConfigObject = getWizardConfigObject();
    if (wizardConfigObject.templates.length === 0) {
        console.log("\n No templates found!! 😔\n");
        process.exit();
    }
    return wizardConfigObject.templates;
};
