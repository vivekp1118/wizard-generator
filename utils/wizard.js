import fs from "fs";

export const getWizardConfigObject = () => {
    let wizardConfigObject = null;
    if (fs.existsSync("./wizard.json")) {
        wizardConfigObject = JSON.parse(fs.readFileSync("./wizard.json", "utf-8"));
    }
    if (!wizardConfigObject) {
        console.log("wizard.json file not found!!");
        process.exit();
    }
    return wizardConfigObject;
};

export const generateTemplateCode = (templateName) => {
    let newTemplateName = templateName
        .toLowerCase()
        .replace("-", " ")
        .replace("_", " ")
        .split(" ")
        .map((item) => item[0])
        .join("");

    return newTemplateName + Math.floor(Math.random(3) * 1000);
};

export const isWizardConfigAvailable = () => {
    const list = fs.readdirSync("./");
    if (list.includes("wizard.json")) {
        return true;
    }
};

export const generateWizardConfig = async (isUsingSrc) => {
    fs.writeFileSync(
        "wizard.json",
        JSON.stringify(
            {
                path: isUsingSrc ? "./src" : "./",
                templatePath: "./templates",
                templates: []
            },
            null,
            4
        )
    );
    if (!fs.existsSync("./templates")) fs.mkdirSync("./templates");
};

export const updateWizardConfig = (wizardObj) =>
    fs.writeFileSync("wizard.json", JSON.stringify(wizardObj, null, 4));
