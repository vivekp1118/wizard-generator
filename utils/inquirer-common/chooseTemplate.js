import inquirer from "inquirer";

export const chooseTemplate = async (allTemplates) => {
    const allTemplatesName = allTemplates.map((item) => item.templateName);
    const selectedTemplate = await inquirer
        .prompt([
            {
                type: "list",
                name: "selectedTemplateName",
                message: "select template",
                choices: allTemplatesName
            }
        ])
        .then(({ selectedTemplateName }) => {
            console.log("selectedTemplateName: ", selectedTemplateName);
            const index = allTemplates.findIndex(
                (item) => item.templateName === selectedTemplateName
            );
            return allTemplates[index];
        });
    return selectedTemplate;
};
