import { get_questions, TriviaResult } from '../API/api';
import { all } from '../lib/list';

export async function collect_questions_from_API(api_url: string) {
    const API_response = await get_questions(api_url);

    const all_questions: TriviaResult[] = API_response.results;

    return all_questions;
}

export function create_question(question: TriviaResult) {
    console.log();
    console.log("----------");
    console.log(`Kategori: ${question.category}`);
    console.log(`Svårighetsgrad: ${question.difficulty}`);
    console.log(`Fråga: ${question.question}`);
    console.log("Svarsalternativ:");

    // Vi lägger ihop det rätta svaret med de felaktiga svaren till en enda Array
    const all_options = [question.correct_answer].concat(question.incorrect_answers);
    const shuffled_options = all_options.sort(() => Math.random() - 0.5);

    shuffled_options.forEach((option: string, index: number) => {
        console.log(`${index + 1}: ${option}`);
    });

    console.log(`----------
    `);
    
    // Letar upp var det rätta svaret hamnade och skickar tillbaka det numret (1-4)
    return shuffled_options.indexOf(question.correct_answer) + 1;
}