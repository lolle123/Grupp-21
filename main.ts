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
 * Huvudfunktionen som startar applikationen och hanterar inloggningsloopen.
 * @complexity O(n) där n är antalet gånger användaren väljer att logga in.
 * @returns {Promise<void>} Ett löfte som hanterar applikationens livscykel.
 */
export async function startApp(): Promise<void> {
    // Vi lägger allt i en loop så man kommer tillbaka hit efter "Logga ut"
    while (true) {
        console.log();
        console.log("------ QuizWarrior ------");
        console.log("1) Logga in / Skapa konto");
        console.log("2) Avsluta programmet");
        
        console.log();
        const startVal = prompt("Ditt val: ");

        if (startVal === "2") {
            console.log("Programmet avslutas");
            break;
        } else if (startVal === "1") {
            const loggedInPlayer = login();
            if (loggedInPlayer !== null) {
                await game(loggedInPlayer);
                // När game() är klar (vid logout) kommer vi tillbaka hit
                // och loopen startar om, vilket visar startmenyn igen.
            }
        } else {
            console.log("Vänligen välj 1 eller 2.");
        }
    }
}

startApp();