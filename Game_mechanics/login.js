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
 * Gives strings a number so they can be used as keys in hash function.
 * Genererar ett hash-värde för en given strängnyckel.
 * @param {string} key - Strängen som ska hashas.
 * @returns {number} Det resulterande heltalet (hash-värdet).
 * @complexity O(n) där n är längden på strängen key.
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
 * En hashtabell som fungerar som databas för alla registrerade spelare.
 */
exports.player_database = ((0, hashtables_1.ph_empty)(10, exports.hash_func));
/**
 * Räknare för antal misslyckade inloggningsförsök.
 */
var tries = 0;
/**
 * Hanterar inloggningsprocessen genom att kontrollera användarnamn och lösenord.
 * @example login();
 * @returns {Player | null} Returnerar spelaren vid lyckad inloggning, annars null.
 * @precondition tries måste vara mindre än 3 för att tillåta nya försök.
 * @complexity O(1) i genomsnitt för uppslagning i hashtabellen.
 **/
function login() {
    // Variant: 3 - tries
    var username_try = prompt("Användarnamn: ");
    if (username_try !== null && tries < 3) {
        var spelare = (0, hashtables_1.ph_lookup)(exports.player_database, username_try);
        if (spelare !== undefined) {
            var password_try = prompt("Lösenord: ");
            if (password_try === spelare.password) {
                console.log("Inloggad! Spelet startar\n                ");
                tries = 0;
                return spelare;
            }
            else {
                console.log("Fel lösenord");
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
    }
    return null;
}
/**
 * Registrerar en ny spelare i systemet med en start-ELO på 1000.
 * @returns {Player | null} Den nyskapade spelaren eller null vid fel.
 * @complexity O(1) för insättning i hashtabellen.
 */
function add_player() {
    var username = prompt("Lägg till användarnamn: ");
    var password = prompt("Lägg till lösenord: ");
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
        console.log("Felaktigt användarnamn eller lösenord");
        return null;
    }
}
//console.log(ph_lookup(player_database, "antonkung"));
