"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envguard = void 0;
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
const colors_1 = __importDefault(require("colors"));
/**
 * Type guard to check if an object is of type KeywordCheckOptions
 * @param {any} obj - Object to be checked
 * @returns {boolean} - True if the object is of type KeywordCheckOptions
 */
function isKeywordCheckOptions(obj) {
    return typeof obj === 'object' && obj !== null && 'strict' in obj;
}
/**
 * Check if specific keywords exist in the .env file and have non-empty values
 * @param {string | string[] | KeywordCheckOptions} keywords - Keywords to check, or options object
 * @param {boolean} onlyWarnings - If true, log warnings only and do not throw errors
 * @throws {Error} - If the .env file is not found or empty (unless onlyWarnings is true)
 */
function envguard(keywords, onlyWarnings = false) {
    // Check if the .env file exists
    if (!fs_1.default.existsSync('.env')) {
        throw new Error(colors_1.default.red('.env file not found'));
    }
    // Check if the .env file is not empty
    const fileContent = fs_1.default.readFileSync('.env', 'utf-8');
    if (fileContent.trim() === '') {
        throw new Error(colors_1.default.red('.env file is empty'));
    }
    // Parse the .env file using dotenv
    const envConfig = dotenv_1.default.parse(fileContent);
    // Extract keys to check and strict mode flag
    const { keysToCheck, strictMode } = extractKeysToCheck(keywords);
    // Check if keywords exist and have non-empty values
    const missingKeys = [];
    keysToCheck.forEach((key) => {
        if (!envConfig[key]) {
            missingKeys.push(key);
        }
    });
    if (missingKeys.length > 0) {
        if (strictMode && !onlyWarnings) {
            const errorMessage = Array.isArray(keywords)
                ? colors_1.default.red(`Required keys missing or empty in .env file: ${missingKeys.join(', ')}`)
                : colors_1.default.red(`Required key missing or empty in .env file: ${missingKeys.join(', ')}`);
            throw new Error(errorMessage);
        }
        else {
            const warningMessage = Array.isArray(keywords)
                ? colors_1.default.magenta(`Warning: The following keys are missing or empty in .env file: ${missingKeys.join(', ')}`)
                : colors_1.default.magenta(`Warning: The key is missing or empty in .env file: ${missingKeys.join(', ')}`);
            console.log(warningMessage);
        }
    }
    else {
        console.log(colors_1.default.green('Checks passed: All required keys exist and have non-empty values'));
    }
}
exports.envguard = envguard;
// Extract keys to check and strict mode flag
function extractKeysToCheck(keywords) {
    if (typeof keywords === 'string') {
        return { keysToCheck: [keywords], strictMode: false };
    }
    if (Array.isArray(keywords)) {
        return { keysToCheck: keywords, strictMode: false };
    }
    if (isKeywordCheckOptions(keywords)) {
        const keysToCheck = Array.isArray(keywords.strict) ? keywords.strict : [keywords.strict];
        return { keysToCheck, strictMode: true };
    }
    throw new Error(colors_1.default.red('Invalid argument for keywordCheck. Expected string, string[], or KeywordCheckOptions object.\n\nExample: keywordCheck(\'API_KEY\') or keywordCheck([\'API_KEY\', \'API_SECRET\']) or keywordCheck({ strict: [\'API_KEY\', \'API_SECRET\'] })'));
}
