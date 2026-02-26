import {
    member, list, is_null, head
} from '../lib/list'
import {
    ph_empty, ph_lookup, hash_id, ph_keys,
} from '../lib/hashtables'

type old_player = {
    username : string
    password : string
    elo : number
}; 


let player_database = (ph_empty<string, old_player>(100, hash_id));



function login(username: string, password: string, elo: number) : old_player {
    let username_try = prompt("Användarnamn: ")
    let password_try = prompt ("Lösenord: ")
    let spelare = ph_lookup(player_database, username_try);
    if (spelare !== undefined) {
        if (password_try === spelare.password) {

        }
        else {
            console.log("Fel lösenord");
        }
    }
    else {
        console.log("Användare finns inte");
    }
}