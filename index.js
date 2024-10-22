#! /usr/bin/env node

import { isWizardConfigAvailable } from "./utils/wizard.js";
import { getAllConfiguredTemplates } from "./utils/templates.js";
import { chooseDir } from "./utils/chooseDir.js";
import { fileFolderGenerator } from "./utils/generator.js";
import { wizardSetup } from "./utils/inquirer/wizardSetup.js";
import { mainOperationChoice } from "./utils/inquirer/mainOperationChoice.js";
import { performConfiguration } from "./utils/inquirer/performConfiguration.js";
import { getConfigureChoices } from "./utils/inquirer/getConfigureChoices.js";
import { chooseTemplate } from "./utils/inquirer-common/chooseTemplate.js";
import { askConfirmation } from "./utils/inquirer-common/askConfirmation.js";
import { serviceManager } from "./utils/services/service-manager.js";

const args = process.argv.slice(2);

if (!isWizardConfigAvailable()) {
    wizardSetup();
} else if (args.length) {
    await serviceManager(args);
} else if (args.length === 0) {
    console.log("in main wizard");
    const operationChoice = await mainOperationChoice();
    /* configuration */
    if (operationChoice === "configure templates") {
        const configureTemplateChoice = await getConfigureChoices();
        await performConfiguration(configureTemplateChoice);
    }

    /* operation */
    if (operationChoice === "generate from template") {
        const allTemplates = getAllConfiguredTemplates();
        const selectedTemplateDetails = await chooseTemplate(allTemplates);
        console.log("selectedTemplateDetails: ", selectedTemplateDetails);

        const chooseSubDirectory = await askConfirmation(
            `Do you what to choose sub Directory (Press Enter for Y) '${selectedTemplateDetails.startingDir}'`
        );

        if (chooseSubDirectory) {
            const sourceDirectory = await chooseDir(
                selectedTemplateDetails.startingDir
            );
            selectedTemplateDetails.startingDir = sourceDirectory;
            fileFolderGenerator(selectedTemplateDetails);
        } else {
            fileFolderGenerator(selectedTemplateDetails);
        }
    }
}
