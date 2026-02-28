"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
exports.add_player = add_player;
var hashtables_1 = require("../lib/hashtables");
var Game_loop_1 = require("./Game_loop");
// @ts-ignore
var promptSync = require("prompt-sync");
var prompt = promptSync();
var hash_func = function (key) {
    var hash = 0;
    for (var i = 0; i < key.length; i++) {
        hash = hash * 31 + key.charCodeAt(i);
    }
    return hash;
};
var player_database = ((0, hashtables_1.ph_empty)(10, hash_func));
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
                (0, Game_loop_1.game)();
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
        w;
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
        login();
    }
    else {
        console.log("Felaktigt användarnamn eller lösenord");
    }
}
login();
//console.log(ph_lookup(player_database, "antonkung"));
