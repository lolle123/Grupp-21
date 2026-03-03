import { get_questions, TriviaResult } from '../API/api';

// Översätter strängarna från HTML till rätt tecken
function decodeHtml(html: string): string {
    return html
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");
}

// Samlar alla frågor från API:n i en constant i form av interfacen TriviaResult
export async function collect_questions_from_API(api_url: string) {
    const API_response = await get_questions(api_url);

    const all_questions: TriviaResult[] = API_response.results;

    return all_questions;
}

// Skapar layouten för frågorna och returnar vilken index det rätta svaret har
export function create_question(question: TriviaResult) {
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