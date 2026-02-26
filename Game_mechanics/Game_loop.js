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
var create_question_1 = require("./create_question");
var Elo_1 = require("./Elo");
// @ts-ignore
var promptSync = require("prompt-sync");
var prompt = promptSync();
function game() {
    return __awaiter(this, void 0, void 0, function () {
        var inputen;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Welcome to QuizMaster");
                    inputen = prompt("Välj en svårighets grad: Svår, Medel, Lätt: ");
                    if (!(inputen === "Svår")) return [3 /*break*/, 2];
                    return [4 /*yield*/, svår()];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 2:
                    if (!(inputen === "Medel")) return [3 /*break*/, 4];
                    return [4 /*yield*/, medel()];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 4:
                    if (!(inputen === "Lätt")) return [3 /*break*/, 6];
                    return [4 /*yield*/, lätt()];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 6: return [2 /*return*/, "Fel Kommand"];
                case 7: return [2 /*return*/];
            }
        });
    });
}
var P1 = (0, Elo_1.create_player)("Lowe", "123", 500);
function question_loop(curnt, diff) {
    for (var i = 0; i < 10; i = i + 1) {
        (0, create_question_1.create_question)(curnt[i]);
        var start = performance.now();
        var svaretprompt = prompt("Svar: ");
        if (svaretprompt === curnt[i].correct_answer) {
            console.log("Rätt svar!");
            var end = performance.now();
            var timeTaken = end - start;
            var rounded_time = Math.round(timeTaken / 10) * 10;
            (0, Elo_1.elo)(rounded_time, diff, true, P1);
        }
        else {
            console.log("Fel svar brur");
            console.log("R\u00E4tt svar var ".concat(curnt[i].correct_answer));
            (0, Elo_1.elo)(0, diff, false, P1);
        }
    }
}
function svår() {
    return __awaiter(this, void 0, void 0, function () {
        var all_hard_questions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, create_question_1.collect_questions_from_API)("https://opentdb.com/api.php?amount=10&difficulty=hard")];
                case 1:
                    all_hard_questions = _a.sent();
                    question_loop(all_hard_questions, 3);
                    console.log("Bra jobbat här är din ELO: 1000");
                    return [2 /*return*/];
            }
        });
    });
}
function medel() {
    return __awaiter(this, void 0, void 0, function () {
        var current;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, create_question_1.collect_questions_from_API)("https://opentdb.com/api.php?amount=10&difficulty=medium")];
                case 1:
                    current = _a.sent();
                    question_loop(current, 2);
                    console.log("Bra jobbat här är din ELO: 500");
                    return [2 /*return*/];
            }
        });
    });
}
function lätt() {
    return __awaiter(this, void 0, void 0, function () {
        var current;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, create_question_1.collect_questions_from_API)("https://opentdb.com/api.php?amount=10&difficulty=easy")];
                case 1:
                    current = _a.sent();
                    question_loop(current, 1);
                    console.log("Bra jobbat här är din ELO: 0");
                    return [2 /*return*/];
            }
        });
    });
}
game();
