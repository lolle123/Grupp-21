"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.game = game;
exports.question_loop = question_loop;
exports.compquestion_loop = compquestion_loop;
exports.end_screen_menu = end_screen_menu;
var create_question_1 = require("./create_question");
var Elo_1 = require("./Elo");
// @ts-ignore
var promptSync = require("prompt-sync");
var prompt = promptSync();
/**
 * Starts the main menu for the game, The player chooses difficulty.
 * @param {Player} activePlayer - Logged in player.
 * @complexity O(1) for the game, but calls async functions.
 * @returns {Promise<any>} A promise that returns an error when choosing something invalid.
 **/
function game(activePlayer) {
    return __awaiter(this, void 0, void 0, function () {
        var inputen;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("\n            ---------------------\n            Welcome to QuizWarrior");
                    inputen = prompt("Choose difficulty(Easy, Medium, Hard, Comp): ");
                    if (!(inputen === "Hard")) return [3 /*break*/, 2];
                    return [4 /*yield*/, hard(activePlayer)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 9];
                case 2:
                    if (!(inputen === "Medium")) return [3 /*break*/, 4];
                    return [4 /*yield*/, medium(activePlayer)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 9];
                case 4:
                    if (!(inputen === "Easy")) return [3 /*break*/, 6];
                    return [4 /*yield*/, easy(activePlayer)];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 9];
                case 6:
                    if (!(inputen === "Comp")) return [3 /*break*/, 8];
                    return [4 /*yield*/, comp(activePlayer)];
                case 7:
                    _a.sent();
                    return [3 /*break*/, 9];
                case 8: return [2 /*return*/, "Wrong command"];
                case 9: return [2 /*return*/];
            }
        });
    });
}
// Correct answers for the game.
var correct_answer = 0;
/**
 * A loop that handles a game round of 10 questions
 * @param {Array<TriviaResult>} curnt - A list of questions from the API.
 * @param {number} diff - Difficulty of questions(1-3).
 * @param {Player} player - The current player whose elo should be updated.
 * @precondition curnt must contain 10 elements.
 * @complexity O(n) where n is number of questions (Fixated to 10).
 * @returns {void}
 **/
function question_loop(curnt, diff, player) {
    correct_answer = 0;
    for (var i = 0; i < 10; i = i + 1) {
        var start = performance.now();
        var correct_number = (0, create_question_1.Create_question)(curnt[i]);
        var Answerprompt = prompt("Your Answer(number): ");
        var User_choice = parseInt(Answerprompt);
        if (User_choice === correct_number) {
            console.log("\x1b[32mCorrect Answer!\x1b[0m");
            var end = performance.now();
            var timeTaken = end - start;
            var rounded_time = Math.round(timeTaken / 10) * 10;
            correct_answer = correct_answer + 1;
            (0, Elo_1.elo)(rounded_time, diff, true, player);
        }
        else {
            console.log("\u001B[31mWrong Answer\u001B[0m\n                \n            ");
            console.log("Correct number was ".concat(correct_number));
            (0, Elo_1.elo)(0, diff, false, player);
        }
    }
}
/**
 * Creates a question loop specificly for the competitive mode.
 * @example compquestion_loop(questions, 2, player);
 * @param {Array<TriviaResult>} curnt - List of available questions.
 * @param {number} diff - Difficulty of the question.
 * @param {Player} player - The active player.
 * @precondition Curnt can't be an empty list.
 * @complexity O(1) for one lone question.
 * @returns {void}
 **/
function compquestion_loop(curnt, diff, player) {
    // Take first question.
    var question = curnt.shift();
    if (!question)
        return; // No remaining questions.
    var start = performance.now();
    var correct_number = (0, create_question_1.Create_question)(question);
    var Answerprompt = prompt("Your Answer(number): ");
    var User_choice = parseInt(Answerprompt);
    if (User_choice === correct_number) {
        console.log("\x1b[32mCorrect Answer!\x1b[0m");
        var end = performance.now();
        var timeTaken = end - start;
        var rounded_time = Math.round(timeTaken / 10) * 10;
        correct_answer = correct_answer + 1;
        (0, Elo_1.elo)(rounded_time, diff, true, player);
    }
    else {
        console.log("\x1b[31mWrong Answer\x1b[0m");
        console.log("Correct Number was ".concat(correct_number));
        (0, Elo_1.elo)(0, diff, false, player);
    }
}
/**
 * Shows end result and current elo for active player.
 * @param {Player} Player - The player whos result is shown.
 * @complexity O(1).
 * @returns {Promise<void>} A promise that ends when the screen is shown.
 **/
function end_screen(Player) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("----------");
                    console.log("Good job you got \u001B[33m".concat(correct_answer, "/10\u001B[0m Correct"));
                    console.log("Your Elo: ".concat(Player.elo));
                    console.log("----------");
                    return [4 /*yield*/, end_screen_menu(Player)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Handles the players decistion of wether restarting the game or logging out.
 * @param {Player} Player - The active player.
 * @complexity O(1).
 * @returns {Promise<void>} A promise that handles the menu choice.
 **/
function end_screen_menu(Player) {
    return __awaiter(this, void 0, void 0, function () {
        var UserChoice;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("\n        Meny: \n        1) Play again\n        2) Log out     \n\n        ");
                    UserChoice = prompt("Your Choice: ");
                    if (!(UserChoice === "1")) return [3 /*break*/, 2];
                    return [4 /*yield*/, game(Player)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 2:
                    if (!(UserChoice === "2")) return [3 /*break*/, 3];
                    console.log("Logging out...\n            ");
                    return [2 /*return*/];
                case 3:
                    console.log("Choose correct number!");
                    return [4 /*yield*/, end_screen_menu(Player)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    });
}
/**
 * Controles that the correct number of question have been collected and then starts the round,
 * Otherwise the player is redirected to the main menu.
 * @param {Array<TriviaResult>} questions - List of questions from the API.
 * @param {number} diff - Difficulty (1, 2 eller 3).
 * @param {Player} player - The active player.
 * @precondition questions must be a list of TriviaResult.
 * @complexity O(n) where n is the numbers of questions looped in question_loop.
 * @returns {Promise<void>} A promise that ends when the round or redirections is finnished.
 **/
function start_quiz_round(questions, diff, player) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(questions.length === 10)) return [3 /*break*/, 2];
                    question_loop(questions, diff, player);
                    return [4 /*yield*/, end_screen(player)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 2:
                    console.log("Couldn't collect questions. Try again.");
                    return [4 /*yield*/, game(player)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Starts a round with difficulty - hard
 * @param {Player} player - The active player.
 * @complexity O(n) where n is number of questions.
 * @returns {Promise<void>}
 **/
function hard(player) {
    return __awaiter(this, void 0, void 0, function () {
        var url, questions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "https://opentdb.com/api.php?amount=10&difficulty=hard";
                    return [4 /*yield*/, (0, create_question_1.collect_questions_from_API)(url)];
                case 1:
                    questions = _a.sent();
                    return [4 /*yield*/, start_quiz_round(questions, 3, player)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Starts a round with difficulty - medium.
 * @param {Player} player - The active player.
 * @complexity O(n) Where n is number of questions.
 * @returns {Promise<void>}
 **/
function medium(player) {
    return __awaiter(this, void 0, void 0, function () {
        var url, questions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "https://opentdb.com/api.php?amount=10&difficulty=medium";
                    return [4 /*yield*/, (0, create_question_1.collect_questions_from_API)(url)];
                case 1:
                    questions = _a.sent();
                    return [4 /*yield*/, start_quiz_round(questions, 2, player)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Starts a round with difficulty- Easy.
 * @param {Player} player - The active player.
 * @complexity O(n) Where n is number of questions.
 * @returns {Promise<void>}
 **/
function easy(player) {
    return __awaiter(this, void 0, void 0, function () {
        var url, questions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "https://opentdb.com/api.php?amount=10&difficulty=easy";
                    return [4 /*yield*/, (0, create_question_1.collect_questions_from_API)(url)];
                case 1:
                    questions = _a.sent();
                    return [4 /*yield*/, start_quiz_round(questions, 1, player)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * pauses the program for a time to respect the API rate limits which is 5 secounds.
 * @param {number} ms - number of millisecounds the program should wait.
 * @returns {Promise<void>}
 **/
function sleep(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
/**
 * Handles game mode (Comp) where difficulty is based on the players e
 * @example await comp(activePlayer);
 * @param {Player} player - The active player.
 * @precondition Player needs to be logged in to get an elo value.
 * @complexity O(n) where n is the amount of questions. Including network waiting time.
 * @returns {Promise<void>}
 **/
function comp(player) {
    return __awaiter(this, void 0, void 0, function () {
        var easy, medium, hard, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, create_question_1.collect_questions_from_API)("https://opentdb.com/api.php?amount=10&difficulty=easy")];
                case 1:
                    easy = _a.sent();
                    console.log("\x1b[31mLoading the game..\x1b[0m");
                    return [4 /*yield*/, sleep(6000)];
                case 2:
                    _a.sent();
                    console.log("\x1b[33m...\x1b[0m");
                    return [4 /*yield*/, (0, create_question_1.collect_questions_from_API)("https://opentdb.com/api.php?amount=10&difficulty=medium")];
                case 3:
                    medium = _a.sent();
                    return [4 /*yield*/, sleep(6000)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, (0, create_question_1.collect_questions_from_API)("https://opentdb.com/api.php?amount=10&difficulty=hard")];
                case 5:
                    hard = _a.sent();
                    correct_answer = 0;
                    for (i = 0; i < 10; i = i + 1) {
                        if (player.elo < 800) {
                            compquestion_loop(easy, 1, player);
                        }
                        else if (player.elo < 1150) {
                            compquestion_loop(medium, 2, player);
                        }
                        else {
                            compquestion_loop(hard, 3, player);
                        }
                    }
                    return [4 /*yield*/, end_screen(player)];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
