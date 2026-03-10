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
 * Taken from PKD lecture.
 * Gives strings a number so they can be used as keys in hash function.
 * Generates a new hash value given a key.
 * @param {string} key - String that's going to be hashed.
 * @returns {number} The resulting number (hash-key).
 * @complexity O(n) where n is the length of the string of key.
 **/
export const hash_func = (key: string): number => {
   let hash = 0
   for (let i = 0; i < key.length; i++) {
        hash = hash * 31 + key.charCodeAt(i);
   }
   return hash;
};

/**
 * A hashtable that works as a database for all registered players.
 */
export let player_database = (ph_empty<string, Player>(10, hash_func));

/**
 * Counter for failed login attempts.
 */
let tries = 0;

/**
 * Handles login by controlling and verifying username and password.
 * @example login();
 * @returns {Player | null} Returns player if login was succesful, otherwise null.
 * @precondition tries must be below 3 to allow login.
 * @complexity O(n) for searching in the hashtable.
 **/
export function login(): Player | null {
    // Variant: 3 - tries
   let username_try = prompt("Username: ")
   if (username_try !== null && tries < 3) {
       let player = ph_lookup(player_database, username_try);
       if (player !== undefined) {
           let password_try = prompt("Password: ")
           if (password_try === player.password) {
               console.log(`Logged in! Game is starting
                `)
               tries = 0;
               return player;
           }
           else {
               console.log("Wrong Password")
               tries = tries + 1;
               return login();
           }
          
       }
       else {
           console.log("User does not exist, create account!");
           return add_player();
       }
   }
   else {
       console.log("Invalid/Too many tries");
} return null;
}  

/**
 * Registers a new player in the system with a base Elo of 1000.
 * @returns {Player | null} The new player or null if wrong.
 * @complexity O(n) for insertion into the hashtable.
 */
export function add_player(): Player | null {
   const username = prompt("Add a username: ")
   const password = prompt("Add a password: ")
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
       console.log("Wrong username or password");
       return null;
   }
}