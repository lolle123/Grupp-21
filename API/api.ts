// Här försöker Adam skriva integration av typer

// Hur enskilda frågorna ser ut från API:et
interface TriviaResult {
    type: string;
    difficulty: string;
    category: string;
    question: string;
    correct_answer: string;
    incorrect_answers: Array<string>;
}

// Hela svaret från API:et
interface TriviaResponse {
    response_code: number;
    results: TriviaResult[];
}

/**
 * Hämtar data från API länken till det format vi vill ha
 * 
 * Info för att förstå funktionen:
 *  Då API_URL verkar ta tid att ladda ner från nätet behövs "async" innan funciton. 
 *  Det gör att vi kan ha "await" inne i funktionen, vilket gör att koden pausar där tills den får svar.
 */
async function get_questions(api_url: string) {
    // fetch hämtar URL:en till ett Response-objekt
    const api_response = await fetch(api_url);
    
    // Här kollar vi vad "kuvertet" (Response) är för något
    console.log("Typ på api_response:", typeof api_response);

    // json översätter texten till ett kod-objekt
    const data: TriviaResponse = await api_response.json();
    // Här kollar vi vad det uppackade innehållet (data) är
    console.log("Typ på data:", typeof data);

    console.log("Här är den första frågan från nätet:", data.results[0].question);
    console.log("här är svaren", data.results[0].incorrect_answers, );
    
    return data; // Skicka tillbaka datan så andra kan använda den
}

get_questions("https://opentdb.com/api.php?amount=10");