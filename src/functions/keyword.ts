import fs from 'fs';
import dotenv from 'dotenv';
import colors from 'colors';

type KeyOrKeys = string | string[];
type KeywordCheckOptions = { strict: KeyOrKeys };

/**
 * Type guard to check if an object is of type KeywordCheckOptions
 * @param {any} obj - Object to be checked
 * @returns {boolean} - True if the object is of type KeywordCheckOptions
 */
function isKeywordCheckOptions(obj: unknown): obj is KeywordCheckOptions {
	return typeof obj === 'object' && obj !== null && 'strict' in obj;
}

/**
 * Check if specific keywords exist in the .env file and have non-empty values
 * @param {string | string[] | KeywordCheckOptions} keywords - Keywords to check, or options object
 * @param {boolean} onlyWarnings - If true, log warnings only and do not throw errors
 * @throws {Error} - If the .env file is not found or empty (unless onlyWarnings is true)
 */
export function k(keywords: KeyOrKeys | KeywordCheckOptions, onlyWarnings: boolean = false): void {
	// Check if the .env file exists
	if (!fs.existsSync('.env')) {
		throw new Error(colors.red('.env file not found'));
	}

	// Check if the .env file is not empty
	const fileContent = fs.readFileSync('.env', 'utf-8');
	if (fileContent.trim() === '') {
		throw new Error(colors.red('.env file is empty'));
	}

	// Parse the .env file using dotenv
	const envConfig = dotenv.parse(fileContent);

	// Extract keys to check and strict mode flag
	const { keysToCheck, strictMode } = extractKeysToCheck(keywords);

	// Check if keywords exist and have non-empty values
	const missingKeys: string[] = [];
	keysToCheck.forEach((key) => {
		if (!envConfig[key]) {
			missingKeys.push(key);
		}
	});

	if (missingKeys.length > 0) {
		if (strictMode && !onlyWarnings) {
			const errorMessage = Array.isArray(keywords)
				? colors.red(`Required keys missing or empty in .env file: ${missingKeys.join(', ')}`)
				: colors.red(`Required key missing or empty in .env file: ${missingKeys.join(', ')}`);

			throw new Error(errorMessage);
		} else {
			const warningMessage = Array.isArray(keywords)
				? colors.magenta(`Warning: The following keys are missing or empty in .env file: ${missingKeys.join(', ')}`)
				: colors.magenta(`Warning: The key is missing or empty in .env file: ${missingKeys.join(', ')}`);

			console.log(warningMessage);
		}
	} else {
		console.log(colors.green('Checks passed: All required keys exist and have non-empty values'));
	}
}

// Extract keys to check and strict mode flag
function extractKeysToCheck(
	keywords: KeyOrKeys | KeywordCheckOptions,
): { keysToCheck: string[]; strictMode: boolean } {
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

	throw new Error(colors.red('Invalid argument for keywordCheck. Expected string, string[], or KeywordCheckOptions object.\n\nExample: keywordCheck(\'API_KEY\') or keywordCheck([\'API_KEY\', \'API_SECRET\']) or keywordCheck({ strict: [\'API_KEY\', \'API_SECRET\'] })'));
}
