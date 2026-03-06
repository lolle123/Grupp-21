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
    if (answer) {
        player.elo += 25 * difficulty;
    }
    else if (player.elo <= 0) {
        player.elo = 0;
    }
    else {
        player.elo -= 25 * difficulty;
    }
    return player;
}
