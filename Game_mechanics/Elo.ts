import { old_player } from '../Types/types'; 

/**
 * Beräknar och uppdaterar spelarens ELO-poäng baserat på svar och svårighetsgrad.
 * @example elo(5000, 2, true, current_player);
 * @param {number} time - Tiden det tog att svara i millisekunder.
 * @param {number} difficulty - Frågans svårighetsgrad (1, 2 eller 3).
 * @param {boolean} answer - Sant om svaret var rätt, annars falskt.
 * @param {old_player} player - Spelarobjektet som ska uppdateras.
 * @precondition difficulty måste vara ett positivt heltal.
 * @complexity O(1) då beräkningen sker i konstant tid.
 * @returns {old_player} Det uppdaterade spelarobjektet.
 **/
export function elo(
    time: number, 
    difficulty: number, 
    answer: boolean, 
    player: old_player
): old_player {
    // Baspoäng per svårighetsgrad
    const base = 20 * difficulty;

    const timeBonus = Math.max(0, 20 - Math.floor(time / 500));

    if (answer) {
        player.elo += base + timeBonus;
    } else {
        player.elo = Math.max(0, player.elo - base);
    }

    return player;
}
