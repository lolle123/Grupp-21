    // Här försöker Adam skriva integration av API

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
    export async function get_questions(api_url: string) : Promise<TriviaResponse> {
        // fetch hämtar URL:en till ett Response-objekt
        const api_response = await fetch(api_url);
        

        // json översätter texten till ett kod-objekt
        const data: TriviaResponse = await api_response.json();
        
        return data; // Skicka tillbaka datan så andra kan använda den
    }