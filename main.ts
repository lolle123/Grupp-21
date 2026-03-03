// main code that glues everything togheter

import {
    login
} from './Game_mechanics/login'
import {
   game
} from './Game_mechanics/Game_loop'

export async function startApp() {
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