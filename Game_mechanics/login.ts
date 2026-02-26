import {
    member, list
} from '../lib/list'
import {
    ph_empty, ph_lookup, hash_id, ph_keys
} from '../lib/hashtables'

type old_player = {
    username : string
    password : string
    elo : number
}; 


let player_database = (ph_empty(100, hash_id));

function usernamesearch() {
    ph_keys(player_database)
}

function login(username: string, password: string, elo: number) : old_player {
    let username_try = prompt("Användarnamn: ");
    if (username_try === )
    if (password_try === ph_lookup(player_database, username))
    }
}