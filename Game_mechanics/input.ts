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
} from '../Game_mechanics/create_question'

import {
    elo
} from '../Game_mechanics/Elo'


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


function question_loop(curnt: TriviaResult[],diff: number): void {
    for (let i = 0; i < 10; i = i + 1) {
        create_question(curnt[i])
        let svaretprompt = prompt("Svar: ")
        if (svaretprompt === curnt[i].correct_answer) {
            console.log("Rätt svar!");
            elo(diff, true, 1000);
        }
        else {
            console.log("Fel svar brur")
            console.log(`Rätt svar var ${curnt[i].correct_answer}`);
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