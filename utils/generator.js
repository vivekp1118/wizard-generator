import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import { getFileDirectoryName } from "./getFileDirectoryName.js";
import { getWizardConfigObject } from "./wizard.js";

let replacedTemplateDirectoryName = false;

export const generateFileContentFromVariables = (
    templateLocation,
    templateVariables
) => {
    const templateFileContent = fs.readFileSync(templateLocation, "utf-8");
    const newFileContent = templateFileContent.replace(
        /<<(.*?)>>/g,
        (match, key) => templateVariables[key.trim()] || ""
    );
    return newFileContent;
};

export const generateDirectoriesAndFile = async (
    templatePath,
    toBeGeneratedPath,
    templateVariables
) => {
    let { fileName, fileExtension } = getFileDirectoryName(templatePath);
    if (templateVariables[fileName]) fileName = templateVariables[fileName];
    const newFileOrDirName = [fileName, fileExtension].filter(Boolean).join(".");

    if (fs.lstatSync(templatePath).isDirectory()) {
        let newPath = path.join(toBeGeneratedPath, newFileOrDirName);
        if (!replacedTemplateDirectoryName) {
            replacedTemplateDirectoryName = true;
            newPath = await inquirer
                .prompt([
                    {
                        type: "input",
                        name: "pathName",
                        message: "Enter DirectoryName"
                    }
                ])
                .then(({ pathName }) => pathName);
            newPath = path.join(toBeGeneratedPath, newPath);
        }

        fs.mkdirSync(newPath, { recursive: true });
        console.log(`Directory ${newPath} created successfully!`);

        const allFiles = fs.readdirSync(templatePath);
        for (const file of allFiles) {
            const filePath = path.join(templatePath, file);
            await generateDirectoriesAndFile(filePath, newPath, templateVariables);
        }
    } else {
        const newFileData = generateFileContentFromVariables(
            templatePath,
            templateVariables
        );
        const newFilePath = path.join(toBeGeneratedPath, newFileOrDirName);

        fs.writeFileSync(newFilePath, newFileData);
        console.log(`File ${newFilePath} created successfully!`);
    }
};

export const fileFolderGenerator = async (templateObj) => {
    const { templateLocation, startingDir, vars } = templateObj;

    console.log("\nEnter values for the following variables \n");
    const questions = vars.map((key) => ({
        type: "input",
        message: `Enter value for ${key}: `,
        name: key
    }));

    const templateVariablesValues = await inquirer.prompt(questions);
    const wizardConfigObject = getWizardConfigObject();
    const { templatePath } = wizardConfigObject;
    const newTemplatePath = path.join(templatePath, templateLocation);
    await generateDirectoriesAndFile(
        newTemplatePath,
        startingDir,
        templateVariablesValues
    );
};
