import inquirer from "inquirer";

export const chooseFromList = async (list, message) => {
    const answer = await inquirer
        .prompt([
            {
                type: "list",
                name: "selected",
                message: message,
                choices: list
            }
        ])
        .then((answers) => {
            return answers.selected;
        })
        .catch((error) => console.log("Error: ", error.message));
};
