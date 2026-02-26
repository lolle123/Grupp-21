"use strict";
// calculates the elo of players depending on time, 
// correct answer and the difficulty of the question
// param- time number, time to answer question
// param - number {1,2,3} difficulty difficulty of ansered question
// param - answer- bolean correct or incorrect answer
// param - current  number- current elo
Object.defineProperty(exports, "__esModule", { value: true });
exports.create_player = create_player;
exports.elo = elo;
function create_player(name, Pass, elo) {
    return { name: name, Pass: Pass, elo: elo };
}
function elo(difficulty, answer, player) {
    if (answer) {
        player.elo += 10 * 10 * difficulty;
    }
    else {
        player.elo -= 50 * (3 - difficulty);
    }
    return player;
}
var P1 = create_player("lowe", "123", 500);
elo(2, true, P1); // uppdaterar P1
console.log(P1.elo);
