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
exports.decodeHtml = decodeHtml;
exports.collect_questions_from_API = collect_questions_from_API;
exports.Create_question = Create_question;
var api_1 = require("../API/api");
/**
 * Translates HTML entities in strings back to standard characters.
 * @param {string} html - The string containing HTML entities.
 * @returns {string} A sanitized string with correct characters.
 * @complexity O(n) where n is the number of entities replaced.
 **/
function decodeHtml(html) {
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
function collect_questions_from_API(api_url) {
    return __awaiter(this, void 0, void 0, function () {
        var API_response, all_questions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, api_1.get_questions)(api_url)];
                case 1:
                    API_response = _a.sent();
                    all_questions = API_response.results;
                    return [2 /*return*/, all_questions];
            }
        });
    });
}
/**
 * Displays a question in the terminal and returns the index of the correct answer.
 * @param {TriviaResult} question - The question object to be displayed.
 * @returns {number} The index of the correct answer.
 * @complexity O(k * log(k)) where k is the number of answer options (due to sorting).
 **/
function Create_question(question) {
    console.log();
    console.log("----------");
    console.log("Category: ".concat(decodeHtml(question.category)));
    console.log("Difficulty: ".concat(decodeHtml(question.difficulty)));
    console.log("Question: ".concat(decodeHtml(question.question)));
    console.log();
    console.log("Answer options:");
    var all_options = [decodeHtml(question.correct_answer)];
    //Pushes the incorrect answers into the all.options array as well
    question.incorrect_answers.forEach(function (option) {
        all_options.push(decodeHtml(option));
    });
    // Shuffles the options so the correct answer isn't always at the same position
    var shuffled_options = all_options.sort(function () { return Math.random() - 0.5; });
    shuffled_options.forEach(function (option, index) {
        console.log("".concat(index + 1, ": ").concat(option));
    });
    console.log("----------");
    return shuffled_options.indexOf(decodeHtml(question.correct_answer)) + 1;
}
