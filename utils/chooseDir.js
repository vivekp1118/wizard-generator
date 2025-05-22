import fs from "fs";
import inquirer from "inquirer";
let getIgnoreFiles = [];

if (fs.existsSync(".gitignore")) {
    getIgnoreFiles = fs.readFileSync("./.gitignore", "utf-8").split("\n");
}

export function getAllSubDirectory(currentDirectory) {
    try {
        let allSubDirectory = fs.readdirSync(currentDirectory).filter((item) => {
            return fs.statSync(`${currentDirectory}/${item}`).isDirectory();
        });

        allSubDirectory = allSubDirectory.filter((file) => !getIgnoreFiles.includes(file));
        return allSubDirectory;
    } catch (e) {
        console.log("ERROR : while getting all 'subdirectory' ", e);
    }
}

export function getPreviousDirectory(currentDirectory) {
    return currentDirectory.split("/").slice(0, -2).join("/") || ".";
}

export async function chooseDir(currentDir = false) {
    try {
        console.log("currentDir: ", currentDir);
        let choiceConfirmed = false;
        let currentDirectory = currentDir || ".";

        while (!choiceConfirmed) {
            let goBack = false;
            let allSubDirectory = getAllSubDirectory(currentDirectory);

            if (currentDirectory !== "." && currentDirectory !== "./" && currentDirectory !== currentDir) allSubDirectory.push("go back");

            if (allSubDirectory.length > 0) {
                currentDirectory =
                    currentDirectory +
                    "/" +
                    (await inquirer
                        .prompt([
                            {
                                type: "rawlist",
                                name: "dir",
                                message: "Choose a directory",
                                choices: allSubDirectory,
                            },
                        ])
                        .then(({ dir }) => {
                            if (dir === "go back") {
                                goBack = true;
                                return "";
                            } else {
                                return dir;
                            }
                        }));

                console.clear();
                console.log("\x1b[1mCurrent Directory:\x1b[0m", currentDirectory);
                console.log("select yes to confirm the directory or no to go into the directory.");

                if (!goBack) {
                    choiceConfirmed = await inquirer
                        .prompt([
                            {
                                type: "confirm",
                                name: "confirm",
                                message: `Do you want to confirm the directory ${currentDirectory} ?`,
                            },
                        ])
                        .then(({ confirm }) => confirm);
                }

                if (goBack) {
                    currentDirectory = getPreviousDirectory(currentDirectory);
                    goBack = false;
                }

                if (choiceConfirmed) {
                    console.log("currentDirectory");
                    return currentDirectory;
                }
            } else {
                console.log("Sub-directories:", 0, "\nCurrentDirectory: ", currentDir);
                console.log("No sub-directories found in the current directory");
                return currentDirectory;
            }
        }
    } catch (e) {
        console.log("ERROR : while getting choosing 'directory' ", e);
    }
}
