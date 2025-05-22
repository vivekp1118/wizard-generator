import path from "path";
import fs from "fs";

const regexDirOrFile = /\[\[[^\[\]]+\]\]/; // Matches strings with [[ and ]]

const removeDynamicBrackets = (name, valuesObj) => {
    let match = name.match(/\[\[(.*?)\]\]/);
    if (match) {
        let extractedKey = match[1];
        let valueFromObject = valuesObj[extractedKey];
        name = name.replace(match[0], valueFromObject);
    }

    return name;
};

const parseFileName = (baseName) => {
    const fileObj = {
        fileName: null,
        fileExtension: null,
    };

    // Split by dots, keeping first part as filename and all except that as extension
    const parts = baseName.split(".");
    if (parts.length > 1) {
        fileObj.fileName = parts[0];
        fileObj.fileExtension = parts.slice(1, parts.length).join(".");
    } else {
        fileObj.fileName = baseName;
    }

    return fileObj;
};

export const getFileDirectoryName = (templatePath, valuesObj) => {
    try {
        let baseName = path.basename(templatePath);
        const isDirectory = fs.lstatSync(templatePath).isDirectory();

        // Common processing for both directory and file names
        if (regexDirOrFile.test(baseName)) {
            if (isDirectory) {
                return {
                    fileName: removeDynamicBrackets(baseName, valuesObj),
                    fileExtension: null,
                };
            } else {
                // For files, remove dynamic parts
                baseName = removeDynamicBrackets(baseName, valuesObj);
                return parseFileName(baseName);
            }
        }

        // If no dynamic parts, use default parsing
        return isDirectory ? { fileName: baseName, fileExtension: null } : parseFileName(baseName);
    } catch (error) {
        console.log("error: ", error);
        console.error(`Error processing template path "${templatePath}": ${error.message}`);
        return { fileName: null, fileExtension: null };
    }
};
