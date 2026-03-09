import { Player } from '../Types/types'; 

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
export function elo(
    time: number, 
    difficulty: number, 
    answer: boolean, 
    player: Player
): Player {
    // Base points calculated per difficulty level
    const base = 20 * difficulty;

    const timeBonus = Math.max(0, 20 - Math.floor(time / 500));

    if (answer) {
        player.elo += base + timeBonus;
    } else {
        player.elo = Math.max(0, player.elo - base);
    }

    return player;
}