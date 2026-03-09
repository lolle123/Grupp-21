"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.player_database = exports.hash_func = void 0;
exports.login = login;
exports.add_player = add_player;
var hashtables_1 = require("../lib/hashtables");
// @ts-ignore
var promptSync = require("prompt-sync");
var prompt = promptSync();
/**
 * Taken from PKD lecture.
 * Gives strings a number so they can be used as keys in hash function.
 * Generates a new hash value given a key.
 * @param {string} key - String that's going to be hashed.
 * @returns {number} The resulting number (hash-key).
 * @complexity O(n) where n is the length of the string of key.
 **/
var hash_func = function (key) {
    var hash = 0;
    for (var i = 0; i < key.length; i++) {
        hash = hash * 31 + key.charCodeAt(i);
    }
    return hash;
};
exports.hash_func = hash_func;
/**
 * A hashtable that works as a database for all registered players.
 */
exports.player_database = ((0, hashtables_1.ph_empty)(10, exports.hash_func));
/**
 * Counter for failed login attempts.
 */
var tries = 0;
/**
 * Handles login by controlling and verifying username and password.
 * @example login();
 * @returns {Player | null} Returns player if login was succesful, otherwise null.
 * @precondition tries must be below 3 to allow login.
 * @complexity Average of O(1) for searching in the hashtable.
 **/
function login() {
    // Variant: 3 - tries
    var username_try = prompt("Username: ");
    if (username_try !== null && tries < 3) {
        var player = (0, hashtables_1.ph_lookup)(exports.player_database, username_try);
        if (player !== undefined) {
            var password_try = prompt("Password: ");
            if (password_try === player.password) {
                console.log("Logged in! Game is starting\n                ");
                tries = 0;
                return player;
            }
            else {
                console.log("Wrong Password");
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
    }
    return null;
}
/**
 * Registers a new player in the system with a base Elo of 1000.
 * @returns {Player | null} The new player or null if wrong.
 * @complexity O(1) for insertion into the hashtable.
 */
function add_player() {
    var username = prompt("Add a username: ");
    var password = prompt("Add a password: ");
    if (username !== null && password !== null) {
        var new_player = {
            username: username,
            password: password,
            elo: 1000
        };
        (0, hashtables_1.ph_insert)(exports.player_database, username, new_player);
        return new_player;
    }
    else {
        console.log("Wrong username or password");
        return null;
    }
}
