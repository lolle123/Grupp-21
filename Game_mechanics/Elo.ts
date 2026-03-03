
// calculates the elo of players depending on time, 
// correct answer and the difficulty of the question
// param- time number, time to answer question
// param - number {1,2,3} difficulty difficulty of ansered question
// param - answer- bolean correct or incorrect answer
// param - current  number- current elo
import { old_player } from '../Types/types'; 

export function elo(time: number, difficulty: number, answer: boolean, player: old_player): old_player {
    if (answer) {
        player.elo += 10 * (Math.round(time/10000)) * difficulty;
    } else if (player.elo <= 0) {
        player.elo = 0
    } else {
        player.elo -= 50 * difficulty;
    }
    return player;
}
