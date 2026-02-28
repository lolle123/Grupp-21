"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
exports.add_player = add_player;
var hashtables_1 = require("../lib/hashtables");
// @ts-ignore
var promptSync = require("prompt-sync");
var prompt = promptSync();
var player_database = ((0, hashtables_1.ph_empty)(10, hashtables_1.hash_id));
var tries = 0;
function login() {
    var username_try = prompt("Användarnamn: ");
    if (username_try !== null) {
        var spelare = (0, hashtables_1.ph_lookup)(player_database, username_try);
        if (spelare !== undefined) {
            var password_try = prompt("Lösenord: ");
            if (password_try === spelare.password && tries < 3) {
                console.log("Inloggad! Spelet startar");
                tries = 0;
                //question_loop();
            }
            else {
                console.log("Fel lösenord eller för många försök");
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
function add_player() {
    var username = prompt("Lägg till användarnamn :");
    var password = prompt("Lägg till lösenord: ");
    if (username !== null && password !== null) {
        var new_player = {
            username: username,
            password: password,
            elo: 1000
        };
        (0, hashtables_1.ph_insert)(player_database, username, new_player);
    }
    else {
        console.log("Felaktigt användarnamn eller lösenord");
    }
}
login();
