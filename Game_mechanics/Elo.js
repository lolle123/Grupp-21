"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.elo = elo;
function elo(time, difficulty, answer, player) {
    if (answer) {
        player.elo += 10 * (Math.round(time / 10000)) * difficulty;
    }
    else if (player.elo <= 0) {
        player.elo = 0;
    }
    else {
        player.elo -= 50 * difficulty;
    }
    return player;
}
