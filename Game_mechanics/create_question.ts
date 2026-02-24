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
    console.log(`----------
        
    `);
    console.log();
}