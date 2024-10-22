import inquirer from "inquirer";

export const mainOperationChoice = async () =>
    await inquirer
        .prompt([
            {
                type: "list",
                name: "operation",
                message: "What do you want to do?",
                choices: ["configure templates", "generate from template"]
            }
        ])
        .then((answer) => {
            return answer.operation;
        })
        .catch((error) => console.log("Error: ", error.message));
