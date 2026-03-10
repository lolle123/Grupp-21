import { get_questions, TriviaResult } from '../API/api';

/**
 * Translates HTML entities in strings back to standard characters.
 * @param {string} html - The string containing HTML entities.
 * @returns {string} A sanitized string with correct characters.
 * @complexity O(n) where n is the number of entities replaced.
 **/
export function decodeHtml(html: string): string {
    return html
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");
}

/**
 * Fetches questions from the API and returns them as an array.
 * @param {string} api_url - The URL string for the API service.
 * @returns {Promise<Array<TriviaResult>>} A promise containing a 
 * list of questions.
 * @complexity O(n) where n is the number of questions in the response.
 **/
export async function collect_questions_from_API(api_url: string): Promise<Array<TriviaResult>> {
    const API_response = await get_questions(api_url);

    const all_questions: Array<TriviaResult> = API_response.results;

    return all_questions;
}

/**
 * Displays a question in the terminal and returns the index of the correct answer.
 * @param {TriviaResult} question - The question object to be displayed.
 * @returns {number} The index of the correct answer.
 * @complexity O(n * log(n)) where n is the number of answer options.
 **/
export function Create_question(question: TriviaResult): number {
    console.log();
    console.log("----------");
    console.log(`Category: ${decodeHtml(question.category)}`);
    console.log(`Difficulty: ${decodeHtml(question.difficulty)}`);
    console.log(`Question: ${decodeHtml(question.question)}`); 
    console.log()
    console.log("Answer options:");

    const all_options = [decodeHtml(question.correct_answer)];
    
    //Pushes the incorrect answers into the all.options array as well
    question.incorrect_answers.forEach((option) => {
        all_options.push(decodeHtml(option));
    });

    // Shuffles the options so the correct answer isn't always at the same position
    const shuffled_options = all_options.sort(() => Math.random() - 0.5);

    shuffled_options.forEach((option: string, index: number) => {
        console.log(`${index + 1}: ${option}`);
    });

    console.log("----------");

    return shuffled_options.indexOf(decodeHtml(question.correct_answer)) + 1;
}