import path from "path"
const regex = /.*<<[^<>]+>>/;

export const getFileDirectoryName = (templatePath) => {
    const baseName = path.basename(templatePath)

    let fileObj = {
        fileName: null,
        fileExtension: null
    };

    if (regex.test(baseName)) {
        const newFileName = baseName.replace('<<', '').replace('>>', '');
        if (newFileName.includes('.')) {
            const [fileName, fileExtension] = newFileName.split('.');
            fileObj.fileName = fileName;
            fileObj.fileExtension = fileExtension;
        } else {
            fileObj.fileName = newFileName;
        }
    } else {
        if (baseName.includes('.')) {
            const [fileName, fileExtension] = baseName.split('.');
            fileObj.fileName = fileName;
            fileObj.fileExtension = fileExtension;
        } else {
            fileObj.fileName = baseName;
        }
    }
    return fileObj;
}