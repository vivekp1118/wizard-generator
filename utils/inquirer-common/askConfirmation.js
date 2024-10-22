import inquirer from "inquirer";

export const askConfirmation = async (message) =>
    await inquirer
        .prompt([
            {
                type: "confirm",
                name: "confirm",
                message,
                default: true
            }
        ])
        .then(({ confirm }) => confirm);
