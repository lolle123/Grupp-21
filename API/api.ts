/**
 * This interface represents the structure of each individual question from the API.
 * It mirrors the API's JSON structure so the parser can map the data correctly.
**/
export interface TriviaResult {
    type: string;
    difficulty: string;
    category: string;
    question: string;
    correct_answer: string;
    incorrect_answers: Array<string>;
}


/**
 * The complete response object from the API.
 * response_code: A status indicator.
 * 0 = Success.
 * Other codes indicate differnet errors (for example, no results found).
 **/
export interface TriviaResponse {
    response_code: number;
    results: Array<TriviaResult>;
}

/**
 * Fetches data from a provided API URL and converts it into a typed object.
 * Function details:
 * - Marked as "async" because fetching data over a network takes time.
 * - Uses "await" to pause execution until the response is received.
 * - Returns a "Promise", guaranteeing a TriviaResponse object in the future.
 * @param {string} api_url - The endpoint to fetch questions from.
 * @returns {Promise<TriviaResponse>} The parsed data from the API.
 */
    export async function get_questions(api_url: string) : Promise<TriviaResponse> {
    // fetch retrieves the data from the URL and returns a Response object
    const api_response = await fetch(api_url);

    // api_response.json() parses the raw text into our defined interface structure.
    // TypeScript ensures that the translated data matches the TriviaResponse type.
    const data: TriviaResponse = await api_response.json();

    // Check if the response code is 0 (Success) according to API documentation
    if (data.response_code !== 0) {
        console.log("A problem occured while gathering questions. Error code: " + data.response_code);
        // Safety measure: Ensure results is an empty array if the fetch fails
        data.results = [];
    } else {
   }    
    return data; // Sends the data back so we can use it
}