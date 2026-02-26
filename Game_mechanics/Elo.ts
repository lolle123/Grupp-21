
// calculates the elo of players depending on time, 
// correct answer and the difficulty of the question
// param- time number, time to answer question
// param - number {1,2,3} difficulty difficulty of ansered question
// param - answer- bolean correct or incorrect answer
// param - current  number- current elo


//lägg in time om vi kan

export type Player = {
    name: string;
    Pass: string;
    elo: number;
};

export function create_player(name: string, Pass: string, elo: number): Player {
    return {name, Pass, elo };
}

export function elo(time: number, difficulty: number, answer: boolean, player: Player): Player {
    if (answer) {
        player.elo += 10 * (10000 - time) * difficulty;
    } else {
        player.elo -= 50 * (3 - difficulty);
    }
    return player;
}

const P1 = create_player("lowe", "123", 500);

elo(200, 2, true, P1);   // uppdaterar P1
console.log(P1.elo);
