    // Här försöker Adam skriva integration av typer

    // Hur enskilda frågorna ser ut från API:et
    export interface TriviaResult {
        type: string;
        difficulty: string;
        category: string;
        question: string;
        correct_answer: string;
        incorrect_answers: Array<string>;
    }

    /**
     * Hela svaret från API:et
     * response_code: Detta är en statuskod.
     * 0 = Allt gick bra (Success).
     * 1 = Inga frågor hittades.
     * 2 = Ogiltig begäran.
     * Bra då vi borde köra response_code === 0 när vi startar spelet
    **/
    export interface TriviaResponse {
        response_code: number;
        results: TriviaResult[];
    }

    /**
     * Hämtar data från API länk och omvandlar till 
     * 
     * Info för att förstå funktionen:
     *  Då API_URL verkar ta tid att ladda ner från nätet behövs "async" innan funciton. 
     *  Det gör att vi kan ha "await" inne i funktionen, vilket gör att koden pausar där tills den får svar.
     */
    export async function get_questions(api_url: string) : Promise<TriviaResult | TriviaResponse> {
        // fetch hämtar URL:en till ett Response-objekt
        const api_response = await fetch(api_url);
        

        // json översätter texten till ett kod-objekt
        const data: TriviaResponse = await api_response.json();
        // Här kollar vi vad det uppackade innehållet (data) är

        console.log("Här är den första frågan från nätet:", data.results[0].question);
        console.log("här är svaren", data.results[0].incorrect_answers, );  
        
        // En loop som går igenom varje fråga i listan
        data.results.forEach((item, index) => {
            console.log(`Fråga nummer ${index + 1}: ${item.question}`);
        });
        
        return data; // Skicka tillbaka datan så andra kan använda den
    }

    get_questions("https://opentdb.com/api.php?amount=10");