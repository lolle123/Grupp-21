//Här skriver Henrik inputen
import {
    pair
} from '../lib/list'
import {
    questionssvår, questionsmedel, questionslätt
} from '../questions'
import {
    get_questions, TriviaResponse, TriviaResult
} from '../API/api';
import {
    collect_questions_from_API, create_question
} from './create_question'

import {
    elo, create_player
} from './Elo'

export type old_player = {
    username: string;
    password: string;
    elo: number;
};

export type Player = {
    name: string;
    Pass: string;
    elo: number;
};

// @ts-ignore
import promptSync = require('prompt-sync');
const prompt = promptSync();


export async function game(activePlayer: old_player) : Promise<any> {
    console.log("Welcome to QuizMaster")
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


export function question_loop(curnt: TriviaResult[], diff: number, player: old_player): void {
    for (let i = 0; i < 10; i = i + 1) {
        const start = performance.now();
        const correct_number = create_question(curnt[i]);
        let svaretprompt = prompt("Ditt svar (Siffra): ")

        const User_choice = parseInt(svaretprompt);

        if (User_choice === correct_number) {
            console.log("Rätt svar!");
            const end = performance.now();
            const timeTaken = end - start;
            const rounded_time = Math.round(timeTaken / 10) * 10;
            elo(rounded_time, diff, true, player);
        }
        else {
            console.log(`Fel svar brur
                
                `
                
            )
            console.log(`Rätt alternativ var nummer ${correct_number}`);
            elo(0, diff, false, player);
        }   
    }
}

async function svår(player: old_player) {
    const all_hard_questions = await collect_questions_from_API("https://opentdb.com/api.php?amount=10&difficulty=hard")
    question_loop(all_hard_questions, 3, player);
    console.log("Bra jobbat här är din ELO: ");
    console.log(player.elo);
} 
async function medel(player: old_player) {
    const current = await collect_questions_from_API("https://opentdb.com/api.php?amount=10&difficulty=medium")
    question_loop(current, 2, player);
    console.log("Bra jobbat här är din ELO: ");
    console.log(player.elo);
}

async function lätt(player: old_player) {
    const current = await collect_questions_from_API("https://opentdb.com/api.php?amount=10&difficulty=easy")
    question_loop(current, 1, player);
    console.log("Bra jobbat här är din ELO: ");
    console.log(player.elo);
}
