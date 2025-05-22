import { chooseDir } from "./chooseDir.js";
import { fileFolderGenerator } from "./generator.js";
import { getAllConfiguredTemplates } from "./templates.js";

export const generateTemplateByIdentifier = async (templateIdentifier) => {
    console.clear();
    const selectedTemplate = await getAllConfiguredTemplates().find(
        (item) => item.templateName === templateIdentifier || item.templateCode === templateIdentifier
    );

    if (!selectedTemplate) {
        console.log(`\nTemplate not found with identifier ${templateIdentifier}\n `);
        process.exit();
    }

    if (selectedTemplate) {
        console.log("selectedTemplate: ", selectedTemplate.startingDir);
        const sourceDirectory = await chooseDir(selectedTemplate.startingDir);
        selectedTemplate.startingDir = sourceDirectory;
        fileFolderGenerator(selectedTemplate);
    }
};
