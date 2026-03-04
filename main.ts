import {
    login
} from './Game_mechanics/login'
import {
   game
} from './Game_mechanics/Game_loop'

/**
 * Huvudfunktionen som startar applikationen och hanterar inloggningsloopen.
 * @complexity O(n) där n är antalet gånger användaren väljer att logga in.
 * @returns {Promise<void>} Ett löfte som hanterar applikationens livscykel.
 */
export async function startApp(): Promise<void> {
    // Vi lägger allt i en loop så man kommer tillbaka hit efter "Logga ut"
    while (true) {
        const loggedInPlayer = login(); // 1. Logga in och fånga spelaren
    
        if (loggedInPlayer !== null) {
            await game(loggedInPlayer); // 2. Starta spelet med den spelaren
        } else {
            console.log("Kunde inte logga in.");
            break;
        }
    }
}

startApp();