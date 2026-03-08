import {
    login, add_player, hash_func, player_database
} from './Game_mechanics/login'
import {
    ph_insert, ph_lookup
} from './lib/hashtables'
import { 
    Player
} from './Types/types'
import {
    elo
} from './Game_mechanics/Elo'
import { 
    Create_question 
} from './Game_mechanics/Create_question'


// @ts-ignore
import promptSync = require('prompt-sync');
import { TriviaResult } from './API/api'

const prompt = promptSync();

test("Login succeeds with correct username and password", () => {
    const player = { username: "henrik", password: "1234", elo: 1000 };
    ph_insert(player_database, "henrik", player);
    expect(ph_lookup(player_database, "henrik")).toEqual(player);
});

test("New player starts with elo 1000", () => {
    const newPlayer = { username: "erik", password: "pw", elo: 1000 };
    expect(newPlayer.elo).toBe(1000);
});

test("Login succeeds with correct username and password", () => {
    const player = { username: "henrik", password: "1234", elo: 1000 };
    ph_insert(player_database, "Player", player);
    expect(ph_lookup(player_database, "player")).toEqual(undefined);
});

test("Database can store multiple players", () => {

    const p1 = { username: "a", password: "1", elo: 1000 };
    const p2 = { username: "b", password: "2", elo: 1000 };

    ph_insert(player_database, "a", p1);
    ph_insert(player_database, "b", p2);

    expect(ph_lookup(player_database, "a")).toEqual(p1);
    expect(ph_lookup(player_database, "b")).toEqual(p2);
});




// test Elo 1
test("Elo increases on correct answer", () => {
const player: Player = { username: "Lowe", password: "123", elo: 1000};
elo(1000, 2, true, player)
expect(player.elo).toBeGreaterThan(1000);
    
});

// test Elo 2
test("Elo increases on incorrect answer", () => {
const player: Player = { username: "Lowe", password: "123", elo: 1000};
elo(1000, 3, false, player)
expect(player.elo).toBeLessThanOrEqual(1000);
    
});

// test("Create_question returns correct answer index", () => {
//   const q: TriviaResult = {
//     category: "Test",
//     difficulty: "easy",
//     question: "2+2?",
//     correct_answer: "4",
//     incorrect_answers: ["1", "2", "3"]
//   };

//   const index = Create_question(q);

//   expect(index).toBeGreaterThanOrEqual(1);
//   expect(index).toBeLessThanOrEqual(4);
// });
