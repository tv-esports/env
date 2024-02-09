type KeyOrKeys = string | string[];
type KeywordCheckOptions = {
    strict: KeyOrKeys;
};
/**
 * Check if specific keywords exist in the .env file and have non-empty values
 * @param {string | string[] | KeywordCheckOptions} keywords - Keywords to check, or options object
 * @param {boolean} onlyWarnings - If true, log warnings only and do not throw errors
 * @throws {Error} - If the .env file is not found or empty (unless onlyWarnings is true)
 */
export declare function k(keywords: KeyOrKeys | KeywordCheckOptions, onlyWarnings?: boolean): void;
export {};
