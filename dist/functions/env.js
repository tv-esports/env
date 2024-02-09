"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const colors_1 = __importDefault(require("colors"));
/**
 * Run a basic test checking if the .env file exists in the directory (recursively)
 * @param {boolean} advanced - If true, returns additional information like path, creation time, and modification time
 * @returns {EnvironmentFileInformation} - Information about the .env file
 * @throws {Error} - If the .env file is not found
 */
function env(advanced) {
    const filePath = findEnvFile(process.cwd());
    if (!filePath) {
        throw new Error(colors_1.default.red('The .env file was not found in the current directory or its parent directories.'));
    }
    const fileStats = fs_1.default.statSync(filePath);
    const createdAt = fileStats.birthtime;
    const updatedAt = fileStats.mtime;
    if (advanced) {
        const fileInformation = {
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
exports.env = env;
function consoleInfo(fileInfo) {
    console.log(colors_1.default.cyan.bold('\n-- General information --'));
    console.log(colors_1.default.cyan('- Current working directory:'), process.cwd());
    console.log(colors_1.default.cyan('- .env working directory:'), path_1.default.dirname(fileInfo.path || ''));
    console.log(colors_1.default.yellow.bold('\n-- ENV file information --'));
    console.log(colors_1.default.yellow('- Created by:'), os_1.default.userInfo().username);
    console.log(colors_1.default.yellow('- Created at:'), fileInfo.createdAt);
    console.log(colors_1.default.yellow('- Updated at:'), fileInfo.updatedAt);
    console.log(colors_1.default.green.bold('\n-- Logging time --'));
    console.log(colors_1.default.green('- Logged time:'), new Date());
    console.log(colors_1.default.green('- User:'), os_1.default.hostname());
}
/**
 * Recursively find the .env file in the given directory or its parent directories
 * @param {string} directory - The starting directory to search for the .env file
 * @returns {string | null} - The path of the .env file, or null if not found
 */
function findEnvFile(directory) {
    const filePath = path_1.default.join(directory, '.env');
    if (fs_1.default.existsSync(filePath)) {
        return filePath;
    }
    const parentDirectory = path_1.default.dirname(directory);
    // If the current directory is the root, stop the recursive search
    if (directory === parentDirectory) {
        return null;
    }
    return findEnvFile(parentDirectory);
}
