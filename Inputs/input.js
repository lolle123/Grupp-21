"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var questions_1 = require("../questions");
// @ts-ignore
var promptSync = require("prompt-sync");
var prompt = promptSync();
function splashscreen() {
    console.log("Welcome to QuizMaster");
    var inputen = prompt("Välj en svårighets grad: Svår, Medel, Lätt");
    if (inputen === "Svår") {
        var svaret = prompt((0, questions_1.questionssvår)());
        if (svaret === "Uplands") {
            return "Rätt";
        }
    }
    else if (inputen === "Medel") {
        var svaret = prompt((0, questions_1.questionsmedel)());
        if (svaret === "Bordet") {
            return "Rätt";
        }
        else {
            return "Fel";
        }
    }
    else if (inputen === "Lätt") {
        var svaret = prompt((0, questions_1.questionslätt)());
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
