import {
    TriviaResult
} from '../API/api';
import {
    collect_questions_from_API, Create_question
} from './create_question'
import {
    elo
} from './Elo'
import {
    Player
} from '../Types/types'

// @ts-ignore
import promptSync = require('prompt-sync');
const prompt = promptSync();

/**
 * Starts the main menu for the game, The player chooses difficulty.
 * @param {Player} activePlayer - Logged in player.
 * @complexity O(1) for the game, but calls async functions.
 * @returns {Promise<any>} A promise that returns an error when choosing something invalid.
 **/
export async function game(activePlayer: Player) : Promise<any> {
    console.log(`
            ---------------------
            Welcome to QuizWarrior`)
    let inputen = prompt("Choose difficulty(Easy, Medium, Hard, Comp): ")
    if (inputen === "Hard") {
        await hard(activePlayer);
        }
    else if (inputen === "Medium") {
        await medium(activePlayer);
        }
    else if (inputen === "Easy") {
        await easy(activePlayer);
        }
    else if (inputen === "Comp") {
        await comp(activePlayer);
    }
    else {
        return "Wrong command";
    }
}

// Correct answers for the game.
var correct_answer = 0

/**
 * A loop that handles a game round of 10 questions
 * @param {Array<TriviaResult>} curnt - A list of questions from the API.
 * @param {number} diff - Difficulty of questions(1-3).
 * @param {Player} player - The current player whose elo should be updated.
 * @precondition curnt must contain 10 elements.
 * @complexity O(n) where n is number of questions (Fixated to 10).
 * @returns {void}
 **/ 
export function question_loop(curnt: Array<TriviaResult>, diff: number, player: Player): void {
   
    correct_answer = 0;

    for (let i = 0; i < 10; i = i + 1) {
        const start = performance.now();
        const correct_number = Create_question(curnt[i]);
        let Answerprompt = prompt("Your Answer(number): ")

        const User_choice = parseInt(Answerprompt);

        if (User_choice === correct_number) {
            console.log("\x1b[32mCorrect Answer!\x1b[0m");
            const end = performance.now();
            const timeTaken = end - start;
            const rounded_time = Math.round(timeTaken / 10) * 10;
            correct_answer = correct_answer + 1;
            elo(rounded_time, diff, true, player);
        }
        else {
            console.log(`\x1b[31mWrong Answer\x1b[0m
                
            `
            )
            console.log(`Correct number was ${correct_number}`);
            elo(0, diff, false, player);

        }   
    }
}

/**
 * Creates a question loop specificly for the competitive mode.
 * @example compquestion_loop(questions, 2, player);
 * @param {Array<TriviaResult>} curnt - List of available questions.
 * @param {number} diff - Difficulty of the question.
 * @param {Player} player - The active player.
 * @precondition Curnt can't be an empty list.
 * @complexity O(1) for one lone question.
 * @returns {void}
 **/
export function compquestion_loop(curnt: TriviaResult[], diff: number, player: Player): void {

    // Take first question.
    const question = curnt.shift();
    if (!question) return;

    const start = performance.now();
    const correct_number = Create_question(question);

    let Answerprompt = prompt("Your Answer(number): ");
    const User_choice = parseInt(Answerprompt);

    if (User_choice === correct_number) {
        console.log("\x1b[32mCorrect Answer!\x1b[0m");
        const end = performance.now();
        const timeTaken = end - start;
        const rounded_time = Math.round(timeTaken / 10) * 10;
        correct_answer = correct_answer + 1;
        elo(rounded_time, diff, true, player);
    } else {
        console.log("\x1b[31mWrong Answer\x1b[0m");
        console.log(`Correct Number was ${correct_number}`);
        elo(0, diff, false, player);
    }
}

/**
 * Shows end result and current elo for active player.
 * @param {Player} Player - The player whos result is shown.
 * @complexity O(1).
 * @returns {Promise<void>} A promise that ends when the screen is shown.
 **/
async function end_screen(Player: Player): Promise<void> {
    console.log("----------");
    console.log(`Good job you got \x1b[33m${correct_answer}/10\x1b[0m Correct`);
    console.log(`Your Elo: ${Player.elo}`);
    console.log("----------");
    await end_screen_menu(Player);
}

/**
 * Handles the players decistion of wether restarting the game or logging out.
 * @param {Player} Player - The active player.
 * @complexity O(1).
 * @returns {Promise<void>} A promise that handles the menu choice.
 **/
export async function end_screen_menu(Player: Player): Promise<void> {
    console.log(`
        Meny: 
        1) Play again
        2) Log out     

        `);
    let UserChoice = prompt("Your Choice: ");
    
    if (UserChoice === "1") {
        await game(Player);
    }
    else if (UserChoice === "2") {
        console.log(`Logging out...
            `);
        return;
    }
    else {
        console.log("Choose correct number!")
        await end_screen_menu(Player);
    }
}

/**
 * Controles that the correct number of question have been collected and then starts the round,
 * Otherwise the player is redirected to the main menu.
 * @param {Array<TriviaResult>} questions - List of questions from the API.
 * @param {number} diff - Difficulty (1, 2 eller 3).
 * @param {Player} player - The active player.
 * @precondition questions must be a list of TriviaResult.
 * @complexity O(n) where n is the numbers of questions looped in question_loop.
 * @returns {Promise<void>} A promise that ends when the round or redirections is finnished.
 **/
async function start_quiz_round(questions: Array<TriviaResult>, diff: number, player: Player): Promise<void> {
    if (questions.length === 10) {
        question_loop(questions, diff, player);
        await end_screen(player);
    } else {
        console.log("Couldn't collect questions. Try again.");
        await game(player);
    }
}

/**
 * Starts a round with difficulty - hard
 * @param {Player} player - The active player.
 * @complexity O(n) where n is number of questions.
 * @returns {Promise<void>}
 **/
async function hard(player: Player): Promise<void> {
    const url = "https://opentdb.com/api.php?amount=10&difficulty=hard";
    const questions = await collect_questions_from_API(url);
    await start_quiz_round(questions, 3, player);
} 

/**
 * Starts a round with difficulty - medium.
 * @param {Player} player - The active player.
 * @complexity O(n) Where n is number of questions.
 * @returns {Promise<void>}
 **/
async function medium(player: Player) {
    const url = "https://opentdb.com/api.php?amount=10&difficulty=medium";
    const questions  = await collect_questions_from_API(url);
    await start_quiz_round(questions, 2, player);
}

/**
 * Starts a round with difficulty- Easy.
 * @param {Player} player - The active player.
 * @complexity O(n) Where n is number of questions.
 * @returns {Promise<void>}
 **/
async function easy(player: Player) {
    const url = "https://opentdb.com/api.php?amount=10&difficulty=easy";
    const questions  = await collect_questions_from_API(url);
    await start_quiz_round(questions, 1, player);
}

/**
 * pauses the program for a time to respect the API rate limits which is 5 secounds.
 * @param {number} ms - number of millisecounds the program should wait.
 * @returns {Promise<void>}
 **/
function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Handles game mode (Comp) where difficulty is based on the players e
 * @example await comp(activePlayer);
 * @param {Player} player - The active player.
 * @precondition Player needs to be logged in to get an elo value.
 * @complexity O(n) where n is the amount of questions. Including network waiting time.
 * @returns {Promise<void>}
 **/
async function comp(player: Player) {
    const easy = await collect_questions_from_API("https://opentdb.com/api.php?amount=10&difficulty=easy")
    console.log("\x1b[31mLoading the game..\x1b[0m");
        await sleep(6000);
    console.log("\x1b[33mLoading...\x1b[0m");
    const medium = await collect_questions_from_API("https://opentdb.com/api.php?amount=10&difficulty=medium")
        await sleep(6000);
    const hard = await collect_questions_from_API("https://opentdb.com/api.php?amount=10&difficulty=hard")
    correct_answer = 0;
        for (let i = 0; i < 10; i = i + 1) {
            if (player.elo < 800) {
              compquestion_loop(easy, 1, player)
          } else if (player.elo < 1150) {
              compquestion_loop(medium, 2, player)
          } else { compquestion_loop(hard, 3, player)}
}
    await end_screen(player);
}