import fs from 'fs';
import path from 'path';
import os from 'os';
import colors from 'colors';

interface EnvironmentFileInformation {
  exists: boolean;
  path?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Run a basic test checking if the .env file exists in the directory (recursively)
 * @param {boolean} advanced - If true, returns additional information like path, creation time, and modification time
 * @returns {EnvironmentFileInformation} - Information about the .env file
 * @throws {Error} - If the .env file is not found
 */
export function env(advanced?: boolean): EnvironmentFileInformation {
	const filePath = findEnvFile(process.cwd());

	if (!filePath) {
		throw new Error(colors.red('The .env file was not found in the current directory or its parent directories.'));
	}

	const fileStats = fs.statSync(filePath);
	const createdAt = fileStats.birthtime;
	const updatedAt = fileStats.mtime;

	if (advanced) {
		const fileInformation: EnvironmentFileInformation = {
			exists: true,
			path: filePath,
			createdAt,
			updatedAt,
		};

		consoleInfo(fileInformation);
		return fileInformation;
	}

	return { exists: true };
}

function consoleInfo(fileInfo: EnvironmentFileInformation): void {
	console.log(colors.cyan.bold('\n-- General information --'));
	console.log(colors.cyan('- Current working directory:'), process.cwd());
	console.log(colors.cyan('- .env working directory:'), path.dirname(fileInfo.path || ''));

	console.log(colors.yellow.bold('\n-- ENV file information --'));
	console.log(colors.yellow('- Created by:'), os.userInfo().username);
	console.log(colors.yellow('- Created at:'), fileInfo.createdAt);
	console.log(colors.yellow('- Updated at:'), fileInfo.updatedAt);

	console.log(colors.green.bold('\n-- Logging time --'));
	console.log(colors.green('- Logged time:'), new Date());
	console.log(colors.green('- User:'), os.hostname());
}

/**
 * Recursively find the .env file in the given directory or its parent directories
 * @param {string} directory - The starting directory to search for the .env file
 * @returns {string | null} - The path of the .env file, or null if not found
 */
function findEnvFile(directory: string): string | null {
	const filePath = path.join(directory, '.env');

	if (fs.existsSync(filePath)) {
		return filePath;
	}

	const parentDirectory = path.dirname(directory);

	// If the current directory is the root, stop the recursive search
	if (directory === parentDirectory) {
		return null;
	}

	return findEnvFile(parentDirectory);
}
