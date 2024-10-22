import inquirer from "inquirer";

export const getConfigureChoices = async () => {
    const choice = await inquirer
        .prompt([
            {
                type: "list",
                name: "operation",
                message: "What do you want to do?",
                choices: [
                    "configure new template",
                    "remove template",
                    "modify existing template"
                ]
            }
        ])
        .then((answer) => {
            return answer.operation;
        });

    return choice;
};
