import {
   member, list, is_null, head
} from '../lib/list'
import {
   ph_empty, ph_lookup, hash_id, ph_keys,
   ph_insert,
} from '../lib/hashtables'
import {
   question_loop
} from '../Game_mechanics/Game_loop'
import {
   game, old_player
} from './Game_loop'

// @ts-ignore
import promptSync = require('prompt-sync');
const prompt = promptSync();


export const hash_func = (key: string): number => {
   let hash = 0
   for (let i = 0; i < key.length; i++) {
        hash = hash * 31 + key.charCodeAt(i);
   }
   return hash;
};


export let player_database = (ph_empty<string, old_player>(10, hash_func));

let tries = 0;


export function login(): old_player | null {
   let username_try = prompt("Användarnamn: ")
   if (username_try !== null && tries < 3) {
       let spelare = ph_lookup(player_database, username_try);
       if (spelare !== undefined) {
           let password_try = prompt("Lösenord: ")
           if (password_try === spelare.password) {
               console.log("Inloggad! Spelet startar")
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

export function add_player(): old_player | null {
   const username = prompt("Lägg till användarnamn: ")
   const password = prompt("Lägg till lösenord: ")
   if (username !== null && password !== null) {
       const new_player : old_player = {
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