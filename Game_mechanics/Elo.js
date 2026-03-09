"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.elo = elo;
/**
 * Calculates and updates the player's ELO points based on their answer and the difficulty level.
 * @example elo(5000, 2, true, current_player);
 * @param {number} time - The time taken to answer in milliseconds.
 * @param {number} difficulty - The difficulty level of the question (1, 2, or 3).
 * @param {boolean} answer - True if the answer was correct, otherwise false.
 * @param {Player} player - The player object to be updated.
 * @precondition difficulty must be a positive integer.
 * @complexity O(1) as the calculation is performed in constant time.
 * @returns {Player} The updated player object.
 **/
function elo(time, difficulty, answer, player) {
    // Base points calculated per difficulty level
    var base = 20 * difficulty;
    var timeBonus = Math.max(0, 20 - Math.floor(time / 500));
    if (answer) {
        player.elo += base + timeBonus;
    }
    else {
        player.elo = Math.max(0, player.elo - base);
    }
    return player;
}
