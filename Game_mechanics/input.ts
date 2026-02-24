//Här skriver Henrik inputen
import {
    pair
} from '../lib/list'
import {
    questionssvår, questionsmedel, questionslätt
} from '../questions'
import
// @ts-ignore
import prom./API/apiquire('prompt-sync');
const prompt = promptSync();

export function splashscreen() : any {
    console.log("Welcome to QuizMaster")
    let inputen = prompt("Välj en svårighets grad: Svår, Medel, Lätt: ")
    if (inputen === "Svår") {
        if (TriviaResult.difficulty === "hard")
            return get_questions(https://opentdb.com/api.php?amount=10&difficulty=hard);    
        }
    }
    else if (inputen === "Medel") {
        let svaret = prompt(questionsmedel())
        if (TriviaResult.difficulty === "medium") {
            return get_questions(https://opentdb.com/api.php?amount=10&difficulty=medium);
        }
        else {
            return "Fel";
        }
    }
    else if (inputen === "Lätt") {
        let svaret = prompt(questionslätt()) 
        if (TriviaResult.diffculty === "easy") {
            return get_questions(https://opentdb.com/api.php?amount=10&difficulty=easy);
        }
    }   
    else {
        return "Fel Kommand";
    }
} 

splashscreen();