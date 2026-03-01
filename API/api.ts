    // Här försöker Adam skriva integration av API

    // Interfacet för hur enskilda frågorna ser ut från API:et.
    // Kopierat samma struktur så att parsern JSON kan hitta rätt.
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
     * Andra siffrora innebär att något gick fel
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
     *  Då API_URL verkar ta tid att ladda ner från nätet behövs "async" innan function. 
     *  Det gör att vi kan ha "await" inne i funktionen, vilket gör att koden pausar där tills den får svar.
     *  Promise innebär att vi lovar att vi kommer skicka tillbaka ett paket av typen TriviaResponse.
     */
    export async function get_questions(api_url: string) : Promise<TriviaResponse> {
        // fetch hämtar URL:en till ett Response-objekt
        const api_response = await fetch(api_url);
        
        // json är en parser som översätter texten från API:n till vår interface struktur.
        // Eftersom vår interface struktur är uppbyggd på samma sätt som API texten kommer det läggas in korrekt. 
        // Att vi sätter typen som TriviaResponse gör att json fattar att översättningnen kommer matcha vår typ.
        const data: TriviaResponse = await api_response.json();
        
        return data; // Skicka tillbaka datan så andra kan använda den
    }