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
    game
} from './Game_loop'



type old_player = {
    username : string
    password : string
    elo : number
}; 

// @ts-ignore
import promptSync = require('prompt-sync');
const prompt = promptSync();

const hash_func = (key: string): number => {
    let hash = 0
    for (let i = 0; i < key.length; i++) {
         hash = hash * 31 + key.charCodeAt(i);
    }
    return hash;
};

let player_database = (ph_empty<string, old_player>(10, hash_func));

let tries = 0;

export function login() {
    let username_try = prompt("Användarnamn: ")
    if (username_try !== null) {
        let spelare = ph_lookup(player_database, username_try);
        if (spelare !== undefined) {
            let password_try = prompt("Lösenord: ")
            if (password_try === spelare.password && tries < 3) {
                console.log("Inloggad! Spelet startar")
                tries = 0;
                game();
            }
            else {
                console.log("Fel lösenord eller för många försök")
                tries = tries + 1; 
            }
        }
        else {
            console.log("Användare finns inte, skapa konto!");
            add_player(); 
        }
    }
    else {
        console.log("Invalid");
    }   
}

export function add_player() {
    const username = prompt("Lägg till användarnamn :")
    const password = prompt("Lägg till lösenord: ")
    if (username !== null && password !== null) {
        const new_player : old_player = {
            username : username,
            password : password,
            elo : 1000
        }
        ph_insert(player_database, username, new_player);
        login();
    }
    else {
        console.log("Felaktigt användarnamn eller lösenord");
    }
}

login();

//console.log(ph_lookup(player_database, "antonkung"));
