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
var Create_question_1 = require("./Create_question");
var Elo_1 = require("./Elo");
// @ts-ignore
var promptSync = require("prompt-sync");
var prompt = promptSync();
/**
 * Startar huvudmenyn för spelet där användaren väljer svårighetsgrad.
 * @param {Player} activePlayer - Den inloggade spelaren.
 * @complexity O(1) för själva valet, men anropar asynkrona funktioner.
 * @returns {Promise<any>} Ett löfte som returnerar ett felmeddelande vid ogiltigt val.
 **/
function game(activePlayer) {
    return __awaiter(this, void 0, void 0, function () {
        var inputen;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("\n            ---------------------\n            Welcome to QuizWarrior");
                    inputen = prompt("Välj en svårighets grad (Easy, Medium, Hard, Comp): ");
                    if (!(inputen === "Hard")) return [3 /*break*/, 2];
                    return [4 /*yield*/, svår(activePlayer)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 9];
                case 2:
                    if (!(inputen === "Medium")) return [3 /*break*/, 4];
                    return [4 /*yield*/, medel(activePlayer)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 9];
                case 4:
                    if (!(inputen === "Easy")) return [3 /*break*/, 6];
                    return [4 /*yield*/, lätt(activePlayer)];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 9];
                case 6:
                    if (!(inputen === "Comp")) return [3 /*break*/, 8];
                    return [4 /*yield*/, comp(activePlayer)];
                case 7:
                    _a.sent();
                    return [3 /*break*/, 9];
                case 8: return [2 /*return*/, "Fel Kommand"];
                case 9: return [2 /*return*/];
            }
        });
    });
}
// Rätt antal svar för sitt game
var rätt_svar = 0;
/**
 * En loop som hanterar en spelrunda med 10 frågor.
 * @param {Array<TriviaResult>} curnt - En lista med frågor från API:et.
 * @param {number} diff - Svårighetsgraden på frågorna (1-3).
 * @param {Player} player - Den aktuella spelaren vars ELO ska uppdateras.
 * @precondition curnt måste innehålla 10 element.
 * @complexity O(n) där n är antalet frågor (här fixerat till 10).
 * @returns {void}
 **/
function question_loop(curnt, diff, player) {
    rätt_svar = 0;
    for (var i = 0; i < 10; i = i + 1) {
        var start = performance.now();
        var correct_number = (0, Create_question_1.Create_question)(curnt[i]);
        var svaretprompt = prompt("Ditt svar (Siffra): ");
        var User_choice = parseInt(svaretprompt);
        if (User_choice === correct_number) {
            console.log("\x1b[32mRätt svar!\x1b[0m");
            var end = performance.now();
            var timeTaken = end - start;
            var rounded_time = Math.round(timeTaken / 10) * 10;
            rätt_svar = rätt_svar + 1;
            (0, Elo_1.elo)(rounded_time, diff, true, player);
        }
        else {
            console.log("\u001B[31mFel svar brur\u001B[0m\n                \n            ");
            console.log("R\u00E4tt alternativ var nummer ".concat(correct_number));
            (0, Elo_1.elo)(0, diff, false, player);
        }
    }
}
/**
 * Bearbetar nästa fråga specifikt för tiva Comp-läget baserat på spelarens ELO.
 * @example compquestion_loop(questions, 2, player);
 * @param {Array<TriviaResult>} curnt - Listan med tillgängliga frågor.
 * @param {number} diff - Svårighetsgraden för frågan.
 * @param {Player} player - Den aktiva spelaren.
 * @precondition curnt får inte vara en tom lista.
 * @complexity O(1) för en enskild fråga.
 * @returns {void}
 **/
function compquestion_loop(curnt, diff, player) {
    // Ta första frågan
    var question = curnt.shift();
    if (!question)
        return; // inga frågor kvar
    var start = performance.now();
    var correct_number = (0, Create_question_1.Create_question)(question);
    var svaretprompt = prompt("Ditt svar (Siffra): ");
    var User_choice = parseInt(svaretprompt);
    if (User_choice === correct_number) {
        console.log("\x1b[32mRätt svar!\x1b[0m");
        var end = performance.now();
        var timeTaken = end - start;
        var rounded_time = Math.round(timeTaken / 10) * 10;
        rätt_svar++;
        (0, Elo_1.elo)(rounded_time, diff, true, player);
    }
    else {
        console.log("\x1b[31mFel svar brur\x1b[0m");
        console.log("R\u00E4tt alternativ var nummer ".concat(correct_number));
        (0, Elo_1.elo)(0, diff, false, player);
    }
}
/**
 * Visar slutresultatet och nuvarande ELO för spelaren.
 * @param {Player} Player - Spelaren vars resultat visas.
 * @complexity O(1).
 * @returns {Promise<void>} Ett löfte som avslutas när skärmen visats.
 **/
function end_screen(Player) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("----------");
                    console.log("Bra jobbat du fick \u001B[33m".concat(rätt_svar, "/10\u001B[0m r\u00E4tt"));
                    console.log("H\u00E4r \u00E4r din ELO: ".concat(Player.elo));
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
 * Hanterar spelarens val att antingen starta om spelet eller logga ut.
 * @param {Player} Player - Den aktiva spelaren.
 * @complexity O(1).
 * @returns {Promise<void>} Ett löfte som hanterar menyvalet.
 **/
function end_screen_menu(Player) {
    return __awaiter(this, void 0, void 0, function () {
        var UserChoice;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("\n        Meny: \n        1) Play again\n        2) Log out     \n\n        ");
                    UserChoice = prompt("Ditt val: ");
                    if (!(UserChoice === "1")) return [3 /*break*/, 2];
                    return [4 /*yield*/, game(Player)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 2:
                    if (!(UserChoice === "2")) return [3 /*break*/, 3];
                    console.log("Loggar ut...\n            ");
                    return [2 /*return*/];
                case 3:
                    console.log("Skriv rätt siffra brur!");
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
 * Kontrollerar att rätt antal frågor hämtats och startar quiz-rundan,
 * annars omdirigeras spelaren till huvudmenyn.
 * @param {Array<TriviaResult>} questions - Listan med frågor från API:et.
 * @param {number} diff - Svårighetsgraden (1, 2 eller 3).
 * @param {Player} player - Den aktiva spelaren.
 * @precondition questions måste vara en lista av TriviaResult.
 * @complexity O(n) där n är antalet frågor som loopas i question_loop.
 * @returns {Promise<void>} Ett löfte som avslutas när rundan eller omdirigeringen är klar.
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
                    console.log("Kunde inte hämta frågor. Försök igen.");
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
 * Startar en runda med svårighetsgrad: Hard.
 * @param {Player} player - Den aktiva spelaren.
 * @complexity O(n) där n är antalet frågor.
 * @returns {Promise<void>}
 **/
function svår(player) {
    return __awaiter(this, void 0, void 0, function () {
        var url, questions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "https://opentdb.com/api.php?amount=10&difficulty=hard";
                    return [4 /*yield*/, (0, Create_question_1.collect_questions_from_API)(url)];
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
 * Startar en runda med svårighetsgrad: Medium.
 * @param {Player} player - Den aktiva spelaren.
 * @complexity O(n) där n är antalet frågor.
 * @returns {Promise<void>}
 **/
function medel(player) {
    return __awaiter(this, void 0, void 0, function () {
        var url, questions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "https://opentdb.com/api.php?amount=10&difficulty=medium";
                    return [4 /*yield*/, (0, Create_question_1.collect_questions_from_API)(url)];
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
 * Startar en spelrunda med svårighetsgrad: Easy.
 * @param {Player} player - Den aktiva spelaren.
 * @complexity O(n) där n är antalet frågor.
 * @returns {Promise<void>}
 **/
function lätt(player) {
    return __awaiter(this, void 0, void 0, function () {
        var url, questions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "https://opentdb.com/api.php?amount=10&difficulty=easy";
                    return [4 /*yield*/, (0, Create_question_1.collect_questions_from_API)(url)];
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
 * Pausar programkörningen under en tid för att respektera API:ets rate limits vilket är 5 sekunder.
 * @param {number} ms - Antal millisekunder programmet ska vänta.
 * @returns {Promise<void>}
 **/
function sleep(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
/**
 * Hanterar game modet (Comp) där svårighetsgraden ändras baserat på spelarens nuvarande ELO.
 * @example await comp(activePlayer);
 * @param {Player} player - Den aktiva spelaren.
 * @precondition Spelaren måste vara inloggad och ha ett giltigt ELO-värde.
 * @complexity O(n) där n är antalet frågor. Inkluderar nätverksanrop med väntetid.
 * @returns {Promise<void>}
 **/
function comp(player) {
    return __awaiter(this, void 0, void 0, function () {
        var Lätt, medel, hard, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, Create_question_1.collect_questions_from_API)("https://opentdb.com/api.php?amount=10&difficulty=easy")];
                case 1:
                    Lätt = _a.sent();
                    console.log("\x1b[31mDeleting all files from Document\x1b[0m");
                    return [4 /*yield*/, sleep(6000)];
                case 2:
                    _a.sent();
                    console.log("\x1b[33m100/105 Deleted\x1b[0m");
                    return [4 /*yield*/, (0, Create_question_1.collect_questions_from_API)("https://opentdb.com/api.php?amount=10&difficulty=medium")];
                case 3:
                    medel = _a.sent();
                    return [4 /*yield*/, sleep(6000)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, (0, Create_question_1.collect_questions_from_API)("https://opentdb.com/api.php?amount=10&difficulty=hard")];
                case 5:
                    hard = _a.sent();
                    rätt_svar = 0;
                    for (i = 0; i < 10; i = i + 1) {
                        if (player.elo < 800) {
                            compquestion_loop(Lätt, 1, player);
                        }
                        else if (player.elo < 1150) {
                            compquestion_loop(medel, 2, player);
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
