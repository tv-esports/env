"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.L = exports.LogLevel = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const colors_1 = __importDefault(require("colors"));
var LogLevel;
(function (LogLevel) {
    LogLevel["SOFT"] = "soft";
    LogLevel["ERROR"] = "error";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
class L {
    options;
    constructor(options = {}) {
        this.options = {
            logLevel: LogLevel.SOFT,
            enableTimestamp: true,
            timeZone: 'Europe/Berlin',
            dateFormat: 'en-US', // Default format: day-month-year
            showLogLevel: true,
            enableConsole: true,
            writeToFile: false,
            ...options,
        };
    }
    getCurrentTimestamp() {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat(this.options.dateFormat, {
            timeZone: this.options.timeZone,
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
        });
        return formatter.format(now);
    }
    generateAutoFileName() {
        const datePart = new Date().toLocaleDateString('en-GB').split('/').join('-');
        const randomId = Math.floor(Math.random() * 10000);
        return `${datePart}-${randomId}`;
    }
    getFilePath() {
        if (this.options.filePath === 'AUTO' || !this.options.filePath) {
            const logsFolderPath = path_1.default.join(process.cwd(), 'logs');
            if (!fs_1.default.existsSync(logsFolderPath)) {
                fs_1.default.mkdirSync(logsFolderPath, { recursive: true });
            }
            const autoFileName = this.generateAutoFileName();
            return path_1.default.join(logsFolderPath, `${autoFileName}.log`);
        }
        return this.options.filePath;
    }
    logMessage(level, message) {
        let formattedMessage = message;
        if (this.options.enableTimestamp) {
            const timestamp = this.getCurrentTimestamp();
            formattedMessage = `[${timestamp}] ${formattedMessage}`;
        }
        if (this.options.showLogLevel) {
            formattedMessage = `[${level.toUpperCase()}] ${formattedMessage}`;
        }
        if (this.options.enableConsole) {
            this.logToConsole(level, formattedMessage);
        }
        if (this.options.writeToFile) {
            this.logToFile(formattedMessage);
        }
        if (level === LogLevel.ERROR) {
            throw new Error(message);
        }
    }
    logToConsole(level, formattedMessage) {
        switch (level) {
            case LogLevel.SOFT:
                console.log(colors_1.default.magenta(formattedMessage));
                break;
            case LogLevel.ERROR:
                console.log(colors_1.default.red(formattedMessage));
                break;
            default:
                console.log(formattedMessage);
                break;
        }
    }
    logToFile(message) {
        const filePath = this.getFilePath();
        try {
            // Create the log file if it doesn't exist
            if (!fs_1.default.existsSync(filePath)) {
                fs_1.default.writeFileSync(filePath, '');
            }
            fs_1.default.appendFileSync(filePath, `${message}\n`, 'utf-8');
        }
        catch (error) {
            console.error(colors_1.default.red(`Error writing LOG files: ${error}`));
        }
    }
    scan(message) {
        this.logMessage(this.options.logLevel, message);
    }
}
exports.L = L;
// import { L, LogLevel } from 'x';
// export * from './functions/env';
// export * from './functions/keyword';
// export * from './functions/logger';
// const logger = new L({
// 	logLevel: LogLevel.SOFT,
// 	enableTimestamp: true,
// 	timeZone: 'Europe/Berlin',
// 	dateFormat: 'en-US',
// 	showLogLevel: true,
// 	enableConsole: true,
// 	writeToFile: true,
// 	filePath: 'AUTO',
// });
