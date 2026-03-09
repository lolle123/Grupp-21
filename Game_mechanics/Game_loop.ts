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
 * Startar huvudmenyn för spelet där användaren väljer svårighetsgrad.
 * @param {Player} activePlayer - Den inloggade spelaren.
 * @complexity O(1) för själva valet, men anropar asynkrona funktioner.
 * @returns {Promise<any>} Ett löfte som returnerar ett felmeddelande vid ogiltigt val.
 **/
export async function game(activePlayer: Player) : Promise<any> {
    console.log(`
            ---------------------
            Welcome to QuizWarrior`)
    let inputen = prompt("Välj en svårighets grad (Easy, Medium, Hard, Comp): ")
    if (inputen === "Hard") {
        await svår(activePlayer);
        }
    else if (inputen === "Medium") {
        await medel(activePlayer);
        }
    else if (inputen === "Easy") {
        await lätt(activePlayer);
        }
    else if (inputen === "Comp") {
        await comp(activePlayer);
    }
    else {
        return "fel kommand";
    }
}

// Rätt antal svar för sitt game
var rätt_svar = 0

/**
 * En loop som hanterar en spelrunda med 10 frågor.
 * @param {Array<TriviaResult>} curnt - En lista med frågor från API:et.
 * @param {number} diff - Svårighetsgraden på frågorna (1-3).
 * @param {Player} player - Den aktuella spelaren vars ELO ska uppdateras.
 * @precondition curnt måste innehålla 10 element.
 * @complexity O(n) där n är antalet frågor (här fixerat till 10).
 * @returns {void}
 **/
export function question_loop(curnt: Array<TriviaResult>, diff: number, player: Player): void {
   
    rätt_svar = 0;

    for (let i = 0; i < 10; i = i + 1) {
        const start = performance.now();
        const correct_number = Create_question(curnt[i]);
        let svaretprompt = prompt("Ditt svar (Siffra): ")

        const User_choice = parseInt(svaretprompt);

        if (User_choice === correct_number) {
            console.log("\x1b[32mRätt svar!\x1b[0m");
            const end = performance.now();
            const timeTaken = end - start;
            const rounded_time = Math.round(timeTaken / 10) * 10;
            rätt_svar = rätt_svar + 1;
            elo(rounded_time, diff, true, player);
        }
        else {
            console.log(`\x1b[31mFel svar brur\x1b[0m
                
            `
            )
            console.log(`Rätt alternativ var nummer ${correct_number}`);
            elo(0, diff, false, player);

        }   
    }
}

/**
 * Bearbetar nästa fråga specifikt för tiva Comp-läget baserat på spelarens ELO.
 * @example compquestion_loop(questions, 2, player);
 * @param {Array<TriviaResult>} curnt - Listan med tillgängliga frågor.
 * @param {number} diff - Svårighetsgraden för frågan.
 * @param {Player} player - Den aktiva spelaren.
 * @precondition curnt får inte vara en tom lista.
 * @complexity O(1) för en enskild fråga.
 * @returns {void}
 **/
export function compquestion_loop(curnt: TriviaResult[], diff: number, player: Player): void {

    // Ta första frågan
    const question = curnt.shift();
    if (!question) return; // inga frågor kvar

    const start = performance.now();
    const correct_number = Create_question(question);

    let svaretprompt = prompt("Ditt svar (Siffra): ");
    const User_choice = parseInt(svaretprompt);

    if (User_choice === correct_number) {
        console.log("\x1b[32mRätt svar!\x1b[0m");
        const end = performance.now();
        const timeTaken = end - start;
        const rounded_time = Math.round(timeTaken / 10) * 10;
        rätt_svar++;
        elo(rounded_time, diff, true, player);
    } else {
        console.log("\x1b[31mFel svar brur\x1b[0m");
        console.log(`Rätt alternativ var nummer ${correct_number}`);
        elo(0, diff, false, player);
    }
}

/**
 * Visar slutresultatet och nuvarande ELO för spelaren.
 * @param {Player} Player - Spelaren vars resultat visas.
 * @complexity O(1).
 * @returns {Promise<void>} Ett löfte som avslutas när skärmen visats.
 **/
async function end_screen(Player: Player): Promise<void> {
    console.log("----------");
    console.log(`Bra jobbat du fick \x1b[33m${rätt_svar}/10\x1b[0m rätt`);
    console.log(`Här är din ELO: ${Player.elo}`);
    console.log("----------");
    await end_screen_menu(Player);
}

/**
 * Hanterar spelarens val att antingen starta om spelet eller logga ut.
 * @param {Player} Player - Den aktiva spelaren.
 * @complexity O(1).
 * @returns {Promise<void>} Ett löfte som hanterar menyvalet.
 **/
export async function end_screen_menu(Player: Player): Promise<void> {
    console.log(`
        Meny: 
        1) Play again
        2) Log out     

        `);
    let UserChoice = prompt("Ditt val: ");
    
    if (UserChoice === "1") {
        await game(Player);
    }
    else if (UserChoice === "2") {
        console.log(`Loggar ut...
            `);
        return;
    }
    else {
        console.log("Skriv rätt siffra brur!")
        await end_screen_menu(Player);
    }
}

/**
 * Kontrollerar att rätt antal frågor hämtats och startar quiz-rundan, 
 * annars omdirigeras spelaren till huvudmenyn.
 * @param {Array<TriviaResult>} questions - Listan med frågor från API:et.
 * @param {number} diff - Svårighetsgraden (1, 2 eller 3).
 * @param {Player} player - Den aktiva spelaren.
 * @precondition questions måste vara en lista av TriviaResult.
 * @complexity O(n) där n är antalet frågor som loopas i question_loop.
 * @returns {Promise<void>} Ett löfte som avslutas när rundan eller omdirigeringen är klar.
 **/
async function start_quiz_round(questions: Array<TriviaResult>, diff: number, player: Player): Promise<void> {
    if (questions.length === 10) {
        question_loop(questions, diff, player);
        await end_screen(player);
    } else {
        console.log("Kunde inte hämta frågor. Försök igen.");
        await game(player);
    }
}

/**
 * Startar en runda med svårighetsgrad: Hard.
 * @param {Player} player - Den aktiva spelaren.
 * @complexity O(n) där n är antalet frågor.
 * @returns {Promise<void>}
 **/
async function svår(player: Player): Promise<void> {
    const url = "https://opentdb.com/api.php?amount=10&difficulty=hard";
    const questions = await collect_questions_from_API(url);
    await start_quiz_round(questions, 3, player);
} 

/**
 * Startar en runda med svårighetsgrad: Medium.
 * @param {Player} player - Den aktiva spelaren.
 * @complexity O(n) där n är antalet frågor.
 * @returns {Promise<void>}
 **/
async function medel(player: Player) {
    const url = "https://opentdb.com/api.php?amount=10&difficulty=medium";
    const questions  = await collect_questions_from_API(url);
    await start_quiz_round(questions, 2, player);
}

/**
 * Startar en spelrunda med svårighetsgrad: Easy.
 * @param {Player} player - Den aktiva spelaren.
 * @complexity O(n) där n är antalet frågor.
 * @returns {Promise<void>}
 **/
async function lätt(player: Player) {
    const url = "https://opentdb.com/api.php?amount=10&difficulty=easy";
    const questions  = await collect_questions_from_API(url);
    await start_quiz_round(questions, 1, player);
}

/**
 * Pausar programkörningen under en tid för att respektera API:ets rate limits vilket är 5 sekunder.
 * @param {number} ms - Antal millisekunder programmet ska vänta.
 * @returns {Promise<void>}
 **/
function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Hanterar game modet (Comp) där svårighetsgraden ändras baserat på spelarens nuvarande ELO.
 * @example await comp(activePlayer);
 * @param {Player} player - Den aktiva spelaren.
 * @precondition Spelaren måste vara inloggad och ha ett giltigt ELO-värde.
 * @complexity O(n) där n är antalet frågor. Inkluderar nätverksanrop med väntetid.
 * @returns {Promise<void>}
 **/
async function comp(player: Player) {
    const Lätt = await collect_questions_from_API("https://opentdb.com/api.php?amount=10&difficulty=easy")
    console.log("\x1b[31mDeleting all files from Document\x1b[0m");
        await sleep(6000);
    console.log("\x1b[33m100/105 Deleted\x1b[0m");
    const medel = await collect_questions_from_API("https://opentdb.com/api.php?amount=10&difficulty=medium")
        await sleep(6000);
    const hard = await collect_questions_from_API("https://opentdb.com/api.php?amount=10&difficulty=hard")
    rätt_svar = 0;
        for (let i = 0; i < 10; i = i + 1) {
            if (player.elo < 800) {
              compquestion_loop(Lätt, 1, player)
          } else if (player.elo < 1150) {
              compquestion_loop(medel, 2, player)
          } else { compquestion_loop(hard, 3, player)}
}
    await end_screen(player);
}