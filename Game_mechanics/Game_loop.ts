import {
    TriviaResult
} from '../API/api';
import {
    collect_questions_from_API, create_question
} from './create_question'
import {
    elo
} from './Elo'
import {
    old_player
} from '../Types/types'
import {
    startApp
} from '../main'

// @ts-ignore
import promptSync = require('prompt-sync');
const prompt = promptSync();

//Frågar om input för svårighetsgrad och kör den svårighetsgraden
export async function game(activePlayer: old_player) : Promise<any> {
    console.log(`
        ---------------------
        Welcome to QuizWarrior`)
    let inputen = prompt("Välj en svårighets grad (Easy, Medium, Hard): ")
    if (inputen === "Hard") {
        await svår(activePlayer);
        }
    else if (inputen === "Medium") {
        await medel(activePlayer);
        }
    else if (inputen === "Easy") {
        await lätt(activePlayer);
        }
    else {
        return "Fel Kommand";
    }
}

// Rätt antal svar för sitt game
var rätt_svar = 0

//Loopen som kör frågorna 10 gånger i rad och kalkylerar ELO under tiden
export function question_loop(curnt: TriviaResult[], diff: number, player: old_player): void {
   
    rätt_svar = 0;

    for (let i = 0; i < 10; i = i + 1) {
        const start = performance.now();
        const correct_number = create_question(curnt[i]);
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

//comp läge
export function compquestion_loop(curnt: TriviaResult[], diff: number, player: old_player): void {
   
    rätt_svar = 0;

    for (let i = 0; i < 1; i = i + 1) {
        const start = performance.now();
        const correct_number = create_question(curnt[i]);
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

// Visar text för end screen med resultat
async function end_screen(Player: old_player) {
    console.log("----------");
    console.log(`Bra jobbat du fick \x1b[33m${rätt_svar}/10\x1b[0m rätt`);
    console.log(`Här är din ELO: ${Player.elo}`);
    console.log("----------");
    await end_screen_menu(Player);
}


export async function end_screen_menu(Player: old_player) {
    console.log(`
        Meny: 
        1) Spela igen
        2) Logga ut       

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

//Svår game mode
async function svår(player: old_player) {
    const all_hard_questions = await collect_questions_from_API("https://opentdb.com/api.php?amount=10&difficulty=hard")
    question_loop(all_hard_questions, 3, player);
    end_screen(player);
} 

// Medel game mode
async function medel(player: old_player) {
    const current = await collect_questions_from_API("https://opentdb.com/api.php?amount=10&difficulty=medium")
    question_loop(current, 2, player);
    end_screen(player);
}

// Lätt game mode
async function lätt(player: old_player) {
    const current = await collect_questions_from_API("https://opentdb.com/api.php?amount=10&difficulty=easy")
    question_loop(current, 1, player);
    await end_screen(player);
}

// comp game mode
async function comp(player: old_player) {
    const Lätt = await collect_questions_from_API("https://opentdb.com/api.php?amount=10&difficulty=easy")
    const medel = await collect_questions_from_API("https://opentdb.com/api.php?amount=10&difficulty=medium")
    const hard = await collect_questions_from_API("https://opentdb.com/api.php?amount=10&difficulty=hard")
    for (let i = 0; i < 10; i = i + 1) {
    if (player.elo < 300) {
        compquestion_loop(Lätt, 1, player)
    } else if (player.elo < 600) {
        compquestion_loop(medel, 2, player)
    } else { compquestion_loop(hard, 3, player)}
}
    await end_screen(player);
}
