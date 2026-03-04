import { get_questions, TriviaResult } from '../API/api';

/**
 * Översätter strängarna från HTML till en sträng med vanliga tecken.
 * @param {string} html - Strängen som innehåller HTML-entiteter.
 * @returns {string} En ren sträng med korrekta tecken.
 * @complexity O(n) där n är antalet entiteter som ersätts.
 **/
function decodeHtml(html: string): string {
    return html
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");
}

/**
 * Hämtar frågor från API:et och returnerar dem som en lista.
 * @param {string} api_url - URL-strängen till API-tjänsten.
 * @returns {Promise<Array<TriviaResult>>} Ett löfte som innehåller en 
 * lista med frågor.
 * @complexity O(n) där n är antalet frågor i svaret.
 **/
export async function collect_questions_from_API(api_url: string): Promise<Array<TriviaResult>> {
    const API_response = await get_questions(api_url);

    const all_questions: Array<TriviaResult> = API_response.results;

    return all_questions;
}

/**
 * Skapar en fråga i terminalen och returnerar det korrekta svarsnumret.
 * @param {TriviaResult} question - Frågeobjektet som ska visas.
 * @returns {number} Indexet för det korrekta svaret.
 * @complexity O(k * log(k)) där k är antalet svarsalternativ (sortering).
 **/
export function Create_question(question: TriviaResult): number {
    console.log();
    console.log("----------");
    console.log(`Kategori: ${decodeHtml(question.category)}`);
    console.log(`Svårighetsgrad: ${decodeHtml(question.difficulty)}`);
    console.log(`Fråga: ${decodeHtml(question.question)}`); 
    console.log()
    console.log("Svarsalternativ:");

    const all_options = [
        decodeHtml(question.correct_answer),
        ...question.incorrect_answers.map(decodeHtml)
    ];

    const shuffled_options = all_options.sort(() => Math.random() - 0.5);

    shuffled_options.forEach((option: string, index: number) => {
        console.log(`${index + 1}: ${option}`);
    });

    console.log("----------");

    return shuffled_options.indexOf(decodeHtml(question.correct_answer)) + 1;
}