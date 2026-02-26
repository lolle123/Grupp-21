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

export type Player = {
    name: string;
    Pass: string;
    elo: number;
};

// @ts-ignore
import promptSync = require('prompt-sync');
const prompt = promptSync();


export async function game() : Promise<any> {
    console.log("Welcome to QuizMaster")
    let inputen = prompt("Välj en svårighets grad: Svår, Medel, Lätt: ")
    if (inputen === "Svår") {
        await svår();
        }
    else if (inputen === "Medel") {
        await medel();
        }
    else if (inputen === "Lätt") {
        await lätt();
        }
    else {
        return "Fel Kommand";
    }
}

const P1 = create_player("Lowe", "123", 500);

function question_loop(curnt: TriviaResult[], diff: number): void {
    for (let i = 0; i < 10; i = i + 1) {
        create_question(curnt[i])
        const start = performance.now();
        let svaretprompt = prompt("Svar: ")
        if (svaretprompt === curnt[i].correct_answer) {
            console.log("Rätt svar!");
            const end = performance.now();
            const timeTaken = end - start;
            const rounded_time = Math.round(timeTaken / 10) * 10;
            elo(rounded_time, diff, true, P1);
        }
        else {
            console.log(`Fel svar brur`
                
            )
            console.log(`Rätt svar var ${curnt[i].correct_answer}`);
            elo(0, diff, false, P1);
        }   
    }
}

async function svår() {
    const all_hard_questions = await collect_questions_from_API("https://opentdb.com/api.php?amount=10&difficulty=hard")
    question_loop(all_hard_questions, 3);
    console.log("Bra jobbat här är din ELO: 1000");
} 
async function medel() {
    const current = await collect_questions_from_API("https://opentdb.com/api.php?amount=10&difficulty=medium")
    question_loop(current, 2)
    console.log("Bra jobbat här är din ELO: 500");
}

async function lätt() {
    const current = await collect_questions_from_API("https://opentdb.com/api.php?amount=10&difficulty=easy")
    question_loop(current, 1)
    console.log("Bra jobbat här är din ELO: 0");
}

game();