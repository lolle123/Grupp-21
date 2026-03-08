/**
 * project.test.ts 
 * Full täckning för QuizWarrior
 */

// @ts-ignore
import promptSync = require('prompt-sync');

// 1. MOCKING (Viktigt: Variabler måste börja med 'mock' för att Jest ska tillåta dem i mocks)
const mockInternalPrompt = jest.fn();
jest.mock('prompt-sync', () => () => mockInternalPrompt);

// Mocka performance.now för tidtagning
const mockNow = jest.fn(() => 0);
global.performance = { now: mockNow } as any;

// Mocka fetch för API-anrop
global.fetch = jest.fn() as jest.Mock;

// Öka timeout till 30 sekunder eftersom Comp-läget har flera sleep(6000)
jest.setTimeout(30000);

import { elo } from './Game_mechanics/Elo';
import { hash_func, login, add_player, player_database } from './Game_mechanics/login';
import { decodeHtml, collect_questions_from_API, Create_question } from './Game_mechanics/create_question';
import { game, question_loop, end_screen_menu } from './Game_mechanics/Game_loop';
import { get_questions } from './API/api';
import { ph_insert } from './lib/hashtables';
import { Player } from './Types/types';

describe('QuizWarrior Ultimate Coverage Suite', () => {

    // Hjälpobjekt för att undvika "undefined"-fel i testerna
    const dummyQuestion = {
        type: "multiple",
        difficulty: "easy",
        category: "General",
        question: "Is this a test?",
        correct_answer: "Yes",
        incorrect_answers: ["No"]
    };

    const testP: Player = { username: "Testare", password: "123", elo: 1000 };

    beforeEach(() => {
        jest.clearAllMocks();
        mockNow.mockReturnValue(0);
    });

    // --- 1. API.TS & CREATE_QUESTION.TS (Mål: 100%) ---
    describe('API & Formatting Logic', () => {
        test('get_questions handles both success and error codes', async () => {
            // Test Success (Kod 0)
            (fetch as jest.Mock).mockResolvedValueOnce({
                json: () => Promise.resolve({ response_code: 0, results: [dummyQuestion] })
            });
            const data = await get_questions("url");
            expect(data.results.length).toBe(1);

            // Test Error (Kod 1-5) - Täcker felhanteringsrader
            (fetch as jest.Mock).mockResolvedValueOnce({
                json: () => Promise.resolve({ response_code: 1, results: [] })
            });
            const errorData = await get_questions("url");
            expect(errorData.results).toEqual([]);
        });

        test('decodeHtml and formatting coverage', () => {
            const entities = "&quot; &amp; &lt; &gt; &#039;";
            expect(decodeHtml(entities)).toBe("\" & < > '");
            
            // Kör Create_question för att täcka utskriftslogik och shuffle
            const correctIdx = Create_question(dummyQuestion);
            expect(correctIdx).toBeGreaterThanOrEqual(1);
        });

        test('collect_questions_from_API coverage', async () => {
            (fetch as jest.Mock).mockResolvedValue({
                json: () => Promise.resolve({ response_code: 0, results: [dummyQuestion] })
            });
            const res = await collect_questions_from_API("url");
            expect(res[0].category).toBe("General");
        });
    });

    // --- 2. LOGIN.TS (Mål: ~90-100%) ---
    describe('Login & User Management', () => {
        test('hash_func and database interactions', () => {
            expect(hash_func("Adam")).toBe(hash_func("Adam"));
            ph_insert(player_database, "Testare", testP);
        });

        test('add_player handles valid and null input', () => {
            // Giltig spelare
            mockInternalPrompt.mockReturnValueOnce("NyAnvändare").mockReturnValueOnce("Lösen");
            const p = add_player();
            expect(p?.username).toBe("NyAnvändare");

            // Null input - Täcker felhantering
            mockInternalPrompt.mockReturnValue(null);
            expect(add_player()).toBeNull();
        });

        test('login handles success, wrong password and null', () => {
            ph_insert(player_database, "Adam", { username: "Adam", password: "123", elo: 1000 });

            // 1. Lyckad inloggning
            mockInternalPrompt.mockReturnValueOnce("Adam").mockReturnValueOnce("123");
            expect(login()?.username).toBe("Adam");

            // 2. Fel lösenord -> Rekursion -> Avbryt (null)
            mockInternalPrompt.mockReturnValueOnce("Adam").mockReturnValueOnce("fel").mockReturnValueOnce(null);
            login();

            // 3. Avbryt direkt
            mockInternalPrompt.mockReturnValueOnce(null);
            expect(login()).toBeNull();
        });
    });

    // --- 3. ELO.TS (Mål: 100%) ---
    describe('Elo Calculations', () => {
        test('Elo changes correctly for all branches', () => {
            const p = { ...testP };
            // Rätt svar + bonus
            elo(500, 2, true, p);
            expect(p.elo).toBe(1059);

            // Fel svar + golv vid 0
            p.elo = 10;
            elo(1000, 3, false, p);
            expect(p.elo).toBe(0);
        });
    });

    // --- 4. GAME_LOOP.TS (Mål: Maxad Statement Coverage) ---
    describe('Game Flow & Modes', () => {
        test('question_loop handles answers and timing', () => {
            const qs = Array(10).fill(dummyQuestion);
            mockInternalPrompt.mockReturnValue("1"); // Rätt svar
            mockNow.mockReturnValueOnce(0).mockReturnValueOnce(1000); // 1 sek tid
            
            question_loop(qs, 1, { ...testP });
        });

        test('game handles all svårighetsgrader', async () => {
            (fetch as jest.Mock).mockResolvedValue({
                json: () => Promise.resolve({ response_code: 0, results: Array(10).fill(dummyQuestion) })
            });

            const modes = ["Easy", "Medium", "Hard", "Comp"];
            for (const mode of modes) {
                mockInternalPrompt.mockReturnValueOnce(mode); // Välj läge
                for(let i=0; i<10; i++) mockInternalPrompt.mockReturnValueOnce("1"); // Svara
                mockInternalPrompt.mockReturnValueOnce("2"); // Logout
                await game({ ...testP });
            }

            // Testa ogiltigt val
            mockInternalPrompt.mockReturnValueOnce("FelVal");
            const res = await game({ ...testP });
            expect(res).toBe("Fel Kommand");
        });

        test('end_screen_menu recursive call on wrong input', async () => {
            mockInternalPrompt.mockReturnValueOnce("99").mockReturnValueOnce("2");
            await end_screen_menu({ ...testP });
        });
    });
});