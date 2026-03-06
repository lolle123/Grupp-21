import {
   ph_empty, ph_lookup, ph_insert,
} from '../lib/hashtables'
import {
   Player
} from '../Types/types'

// @ts-ignore
import promptSync = require('prompt-sync');
const prompt = promptSync();

/**
 * Gives strings a number so they can be used as keys in hash function.
 * Genererar ett hash-värde för en given strängnyckel.
 * @param {string} key - Strängen som ska hashas.
 * @returns {number} Det resulterande heltalet (hash-värdet).
 * @complexity O(n) där n är längden på strängen key.
 **/
export const hash_func = (key: string): number => {
   let hash = 0
   for (let i = 0; i < key.length; i++) {
        hash = hash * 31 + key.charCodeAt(i);
   }
   return hash;
};

/**
 * En hashtabell som fungerar som databas för alla registrerade spelare.
 */
export let player_database = (ph_empty<string, Player>(10, hash_func));

/**
 * Räknare för antal misslyckade inloggningsförsök.
 */
let tries = 0;

/**
 * Hanterar inloggningsprocessen genom att kontrollera användarnamn och lösenord.
 * @example login();
 * @returns {Player | null} Returnerar spelaren vid lyckad inloggning, annars null.
 * @precondition tries måste vara mindre än 3 för att tillåta nya försök.
 * @complexity O(1) i genomsnitt för uppslagning i hashtabellen.
 **/
export function login(): Player | null {
    // Variant: 3 - tries
   let username_try = prompt("Användarnamn: ")
   if (username_try !== null && tries < 3) {
       let spelare = ph_lookup(player_database, username_try);
       if (spelare !== undefined) {
           let password_try = prompt("Lösenord: ")
           if (password_try === spelare.password) {
               console.log(`Inloggad! Spelet startar
                `)
               tries = 0;
               return spelare;
           }
           else {
               console.log("Fel lösenord")
               tries = tries + 1;
               return login();
           }
          
       }
       else {
           console.log("Användare finns inte, skapa konto!");
           return add_player();
       }
   }
   else {
       console.log("Invalid/För många försök");
} return null;
}  

/**
 * Registrerar en ny spelare i systemet med en start-ELO på 1000.
 * @returns {Player | null} Den nyskapade spelaren eller null vid fel.
 * @complexity O(1) för insättning i hashtabellen.
 */
export function add_player(): Player | null {
   const username = prompt("Lägg till användarnamn: ")
   const password = prompt("Lägg till lösenord: ")
   if (username !== null && password !== null) {
       const new_player : Player = {
           username : username,
           password : password,
           elo : 1000
       }
       ph_insert(player_database, username, new_player);
       return new_player;
   }
   else {
       console.log("Felaktigt användarnamn eller lösenord");
       return null;
   }
}

//console.log(ph_lookup(player_database, "antonkung"));