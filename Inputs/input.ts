//Här skriver Henrik inputen
import {
    pair
} from '../lib/list'
import {
    questionssvår, questionsmedel, questionslätt
} from '../questions'
// @ts-ignore
import promptSync = require('prompt-sync');
const prompt = promptSync();

function splashscreen() : any {
    console.log("Welcome to QuizMaster")
    let inputen = prompt("Välj en svårighets grad: Svår, Medel, Lätt: ")
    if (inputen === "Svår") {
        let svaret = prompt(questionssvår())
        if (svaret === "Uplands") {
            return "Rätt";
        }
    }
    else if (inputen === "Medel") {
        let svaret = prompt(questionsmedel())
        if (svaret === "Bordet") {
            return "Rätt";
        }
        else {
            return "Fel";
        }
    }
    else if (inputen === "Lätt") {
        let svaret = prompt(questionslätt()) 
        if (svaret === "7") {
            return "Rätt";
        }
        else {
            return "Fel";
        }
    }   
    else {
        return "Fel Kommand";
    }
} 

splashscreen();