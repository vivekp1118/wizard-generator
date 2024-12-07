import inquirer from "inquirer";
import { generateWizardConfig } from "../wizard.js";

export const wizardSetup = async () => {
    let isUsingSrc = await inquirer
        .prompt([
            {
                type: "confirm",
                name: "isUsingSrc",
                message: "Are you using './src' directory",
            },
        ])
        .then((answer) => {
            return answer.isUsingSrc;
        });

    await generateWizardConfig(isUsingSrc);

    console.log("\n wizard.json file created successfully 🔥\n");
    console.log("\n Please add the templates in the 'templates' directory and run the command again. 🔧\n");
    process.exit(1);
};
