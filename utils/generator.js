import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import { getFileDirectoryName } from "./getFileDirectoryName.js";
import { getWizardConfigObject } from "./wizard.js";

export const generateFileContentFromVariables = (templateLocation, templateVariables) => {
    try {
        const templateFileContent = fs.readFileSync(templateLocation, "utf-8");
        const newFileContent = templateFileContent.replace(/<<(.*?)>>/g, (match, key) => templateVariables[key.trim()] || "");
        return newFileContent;
    } catch (error) {
        console.error(`Error reading template file at ${templateLocation}: ${error.message}`);
        return ""; // Return empty content if there's an error
    }
};

export const generateDirectoriesAndFile = async (templatePath, toBeGeneratedPath, templateVariables) => {
    try {
        let { fileName, fileExtension } = getFileDirectoryName(templatePath, templateVariables);
        const newFileOrDirName = [fileName, fileExtension].filter(Boolean).join(".");

        if (fs.lstatSync(templatePath).isDirectory()) {
            let newPath = path.join(toBeGeneratedPath, newFileOrDirName);
            fs.mkdirSync(newPath, { recursive: true });

            const allFiles = fs.readdirSync(templatePath);
            for (const file of allFiles) {
                const filePath = path.join(templatePath, file);
                await generateDirectoriesAndFile(filePath, newPath, templateVariables);
            }
        } else {
            const newFileData = generateFileContentFromVariables(templatePath, templateVariables);
            const newFilePath = path.join(toBeGeneratedPath, newFileOrDirName);

            if (newFileData) {
                fs.writeFileSync(newFilePath, newFileData);
                console.log(`File ${newFilePath} created successfully!`);
            } else {
                console.error(`Failed to generate content for file: ${newFilePath}`);
            }
        }
    } catch (error) {
        console.log("error: ", error);
        console.error(`Error generating files/directories: ${error.message}`);
    }
};

export const fileFolderGenerator = async (templateObj) => {
    const { templateLocation, startingDir, vars } = templateObj;

    console.log("\nEnter values for the following variables \n");
    const questions = vars.map((key) => ({
        type: "input",
        message: `Enter value for ${key}: `,
        name: key,
    }));

    try {
        const templateVariablesValues = await inquirer.prompt(questions);
        const wizardConfigObject = getWizardConfigObject();
        const { templatePath } = wizardConfigObject;
        const newTemplatePath = path.join(templatePath, templateLocation);

        await generateDirectoriesAndFile(newTemplatePath, startingDir, templateVariablesValues);
    } catch (error) {
        console.error(`Error in file/folder generation: ${error.message}`);
    }
};
