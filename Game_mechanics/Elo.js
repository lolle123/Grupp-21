"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.elo = elo;
/**
 * Beräknar och uppdaterar spelarens ELO-poäng baserat på svar och svårighetsgrad.
 * @example elo(5000, 2, true, current_player);
 * @param {number} time - Tiden det tog att svara i millisekunder.
 * @param {number} difficulty - Frågans svårighetsgrad (1, 2 eller 3).
 * @param {boolean} answer - Sant om svaret var rätt, annars falskt.
 * @param {Player} player - Spelarobjektet som ska uppdateras.
 * @precondition difficulty måste vara ett positivt heltal.
 * @complexity O(1) då beräkningen sker i konstant tid.
 * @returns {Player} Det uppdaterade spelarobjektet.
 **/
function elo(time, difficulty, answer, player) {
    // Baspoäng per svårighetsgrad
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
