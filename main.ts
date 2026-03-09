import {
    login
} from './Game_mechanics/login'
import {
   game
} from './Game_mechanics/Game_loop'

// @ts-ignore
import promptSync = require('prompt-sync');
const prompt = promptSync();

/**
 * The main function that starts the application and manages the login loop.
 * @complexity O(n) where n is the number of times the user chooses to log in.
 * @returns {Promise<void>} A promise managing the application's lifecycle.
 */
export async function startApp(): Promise<void> {
    // A loop so the user returns to the start menu after logging out
    while (true) {
        console.log();
        console.log("------ QuizWarrior ------");
        console.log("1) Login / Create Account");
        console.log("2) Exit program");
        
        console.log();
        const startVal = prompt("Your choice: ");

        if (startVal === "2") {
            console.log("Exitiing program");
            break;
        } else if (startVal === "1") {
            const loggedInPlayer = login();
            if (loggedInPlayer !== null) {
                await game(loggedInPlayer);
                // When game() finishes (on logout), control returns here
                // and the loop restarts, displaying the start menu again.
            }
        } else {
            console.log("Please choose 1 or 2.");
        }
    }
}

// Starts the program
startApp();