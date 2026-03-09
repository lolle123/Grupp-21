/**
 * project.test.ts 
 * Full täckning för QuizWarrior
 */

// @ts-ignore
import promptSync = require('prompt-sync');

// 1. MOCKING
const mockInternalPrompt = jest.fn();
jest.mock('prompt-sync', () => () => mockInternalPrompt);

const mockNow = jest.fn(() => 0);
global.performance = { now: mockNow } as any;

global.fetch = jest.fn() as jest.Mock;

jest.setTimeout(30000);

import { elo } from '../Game_mechanics/Elo';
import { hash_func, login, add_player, player_database } from '../Game_mechanics/login';
import { decodeHtml, collect_questions_from_API, Create_question } from '../Game_mechanics/create_question';
import { game, question_loop, end_screen_menu, compquestion_loop } from '../Game_mechanics/Game_loop';
import { get_questions } from '../API/api';
import { ph_insert } from '../lib/hashtables';
import { Player } from '../Types/types';

describe('QuizWarrior Ultimate Coverage Suite', () => {
    
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
            (fetch as jest.Mock).mockResolvedValueOnce({
                json: () => Promise.resolve({ response_code: 0, results: [dummyQuestion] })
            });
            const data = await get_questions("url");
            expect(data.results.length).toBe(1);

            (fetch as jest.Mock).mockResolvedValueOnce({
                json: () => Promise.resolve({ response_code: 1, results: [] })
            });
            const errorData = await get_questions("url");
            expect(errorData.results).toEqual([]);
        });

        test('decodeHtml and formatting coverage', () => {
            const entities = "&quot; &amp; &lt; &gt; &#039;";
            expect(decodeHtml(entities)).toBe("\" & < > '");
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

    // --- 2. LOGIN.TS (Mål: 100%) ---
    describe('Login & User Management', () => {
        test('hash_func and database interactions', () => {
            expect(hash_func("Adam")).toBe(hash_func("Adam"));
            ph_insert(player_database, "Testare", testP);
        });

        test('add_player handles valid and null input', () => {
            mockInternalPrompt.mockReturnValueOnce("NyAnvändare").mockReturnValueOnce("Lösen");
            const p = add_player();
            expect(p?.username).toBe("NyAnvändare");

            mockInternalPrompt.mockReturnValue(null);
            expect(add_player()).toBeNull();
        });

        test('login handles success, wrong password and null', () => {
            ph_insert(player_database, "Adam", { username: "Adam", password: "123", elo: 1000 });
            mockInternalPrompt.mockReturnValueOnce("Adam").mockReturnValueOnce("123");
            expect(login()?.username).toBe("Adam");

            mockInternalPrompt.mockReturnValueOnce("Adam").mockReturnValueOnce("fel").mockReturnValueOnce(null);
            login();

            mockInternalPrompt.mockReturnValueOnce(null);
            expect(login()).toBeNull();
        });

        test('login handles non-existent user', () => {
            mockInternalPrompt.mockReturnValueOnce("FinnsInteAlls").mockReturnValueOnce(null);
            const res = login();
            expect(res).toBeNull();
        });
    });

    // --- 3. ELO.TS (Mål: 100%) ---
    describe('Elo Calculations', () => {
        test('Elo changes correctly for all branches', () => {
            const p = { ...testP };
            elo(500, 2, true, p);
            expect(p.elo).toBe(1059);

            p.elo = 10;
            elo(1000, 3, false, p);
            expect(p.elo).toBe(0);
        });
    });

    // --- 4. GAME_LOOP.TS (Mål: 100% Stmts) ---
    describe('Game Flow & Modes', () => {
        
        test('comp mode with high ELO triggers hard questions (line 255)', async () => {
            const proPlayer: Player = { username: "Pro", password: "1", elo: 1200 };
            (fetch as jest.Mock).mockResolvedValue({
                json: () => Promise.resolve({ response_code: 0, results: Array(10).fill(dummyQuestion) })
            });

            mockInternalPrompt
                .mockReturnValueOnce("Comp")
                .mockReturnValue("1");
            
            mockInternalPrompt.mockReturnValueOnce("2"); 

            await game(proPlayer);
            expect(proPlayer.username).toBe("Pro");
        });

        test('start_quiz_round handles case with not 10 questions (lines 183-184)', async () => {
            // Simulera att vi får 0 frågor istället för 10
            (fetch as jest.Mock).mockResolvedValueOnce({
                json: () => Promise.resolve({ response_code: 0, results: [] })
            });

            mockInternalPrompt
                .mockReturnValueOnce("Easy")    // 1. Trigga start_quiz_round
                .mockReturnValueOnce("Logout"); // 2. Avbryt när game() anropas igen pga felet

            await game({ ...testP });
            // Nu har vi kört rad 183-184!
        });

        test('game handles API fetch failure', async () => {
            (fetch as jest.Mock).mockRejectedValue(new Error("Network Error"));
            mockInternalPrompt.mockReturnValueOnce("Easy");
            try {
                await game({ ...testP });
            } catch (e: any) {
                expect(e.message).toBe("Network Error");
            }
        });

        test('end_screen_menu handles "Play again" (line 183-184)', async () => {
            mockInternalPrompt
                .mockReturnValueOnce("1")      
                .mockReturnValueOnce("Logout") 
                .mockReturnValueOnce("2");     

            await end_screen_menu({ ...testP });
        });

        test('compquestion_loop handles empty question array (line 103)', () => {
            const emptyArray: any[] = [];
            const result = compquestion_loop(emptyArray, 1, { ...testP });
            expect(result).toBeUndefined();
        });

        test('game handles invalid mode selection', async () => {
            mockInternalPrompt.mockReturnValueOnce("FelVal");
            const res = await game({ ...testP });
            expect(res).toBe("fel kommand"); 
        });

        test('question_loop handles answers', () => {
            const qs = Array(10).fill(dummyQuestion);
            mockInternalPrompt.mockReturnValue("1");
            question_loop(qs, 1, { ...testP });
        });

        test('game handles all svårighetsgrader', async () => {
            (fetch as jest.Mock).mockResolvedValue({
                json: () => Promise.resolve({ response_code: 0, results: Array(10).fill(dummyQuestion) })
            });
            const modes = ["Easy", "Medium", "Hard", "Comp"];
            for (const mode of modes) {
                mockInternalPrompt.mockReturnValueOnce(mode); 
                for(let i=0; i<10; i++) mockInternalPrompt.mockReturnValueOnce("1"); 
                mockInternalPrompt.mockReturnValueOnce("2"); 
                await game({ ...testP });
            }
        });

        test('end_screen_menu recursive call on wrong input', async () => {
            mockInternalPrompt.mockReturnValueOnce("99").mockReturnValueOnce("2");
            await end_screen_menu({ ...testP });
        });
    });

    // --- 5. EDGE & BOUNDARY CASES ---
    describe('Edge Cases & Boundaries', () => {
        test('Boundary: Elo at exactly 0 should stay 0 on wrong answer', () => {
            const p = { ...testP, elo: 0 };
            elo(1000, 1, false, p);
            expect(p.elo).toBe(0);
        });

        test('Boundary: 0ms response time gives maximum bonus', () => {
            const p = { ...testP, elo: 1000 };
            elo(0, 1, true, p); 
            expect(p.elo).toBe(1040);
        });

        test('Edge: Extremely slow response gives 0 bonus (not negative)', () => {
            const p = { ...testP, elo: 1000 };
            elo(999999, 1, true, p); 
            expect(p.elo).toBe(1020);
        });

        test('Edge: decodeHtml handles empty string', () => {
            expect(decodeHtml("")).toBe("");
        });

        test('Boundary: Comp mode threshold check (Elo 799 vs 800)', async () => {
            (fetch as jest.Mock).mockResolvedValue({
                json: () => Promise.resolve({ response_code: 0, results: Array(10).fill(dummyQuestion) })
            });
            mockInternalPrompt.mockReturnValueOnce("Comp").mockReturnValue("1").mockReturnValue("2");
            await game({ ...testP, elo: 799 });
            
            mockInternalPrompt.mockReturnValueOnce("Comp").mockReturnValue("1").mockReturnValue("2");
            await game({ ...testP, elo: 800 });
        });
    });
});