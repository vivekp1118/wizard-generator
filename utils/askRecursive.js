import inquirer from 'inquirer';

/* ask question in recursive manner*/
const allEnteredAnswers = [];

export async function askRecursive(question, fieldToAsk) {
    console.clear()
    console.log(allEnteredAnswers.length > 0 ? allEnteredAnswers : '')
    try {
        const questions = [
            {
                type: 'input',
                name: 'answerInput',
                message: `${question}`,
            },
            {
                type: 'confirm',
                name: 'askAgain',
                message: `Want to enter another ${fieldToAsk} (just hit enter for YES)?`,
                default: true,
            },
        ];

        const answer = await inquirer.prompt(questions);


        if (answer.answerInput) allEnteredAnswers.push(answer.answerInput);


        if (answer.askAgain) {
            return askRecursive(question, fieldToAsk);
        } else {
            return allEnteredAnswers.filter(Boolean);
        }
    } catch (error) {
        console.error('An error occurred while asking the question:', error);
        throw error
    }
}
