import fs from 'fs';
import path from 'path';
import colors from 'colors';

export enum LogLevel {
  SOFT = 'soft',
  ERROR = 'error',
}

interface LoggerOptions {
  logLevel: LogLevel;
  enableTimestamp: boolean;
  timeZone: string; // Specify timezone (e.g., 'Europe/Berlin')
  dateFormat: string; // Specify custom date format using the Intl.DateTimeFormat options
  showLogLevel: boolean; // Show log level in messages
  enableConsole: boolean; // Enable or disable console output
  writeToFile: boolean; // Enable or disable writing logs to a file
  filePath?: string; // Specify the file path for writing logs, 'AUTO' for dynamic filename
}

export class L {
	private options: LoggerOptions;

	constructor(options: Partial<LoggerOptions> = {}) {
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

	private getCurrentTimestamp(): string {
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

	private generateAutoFileName(): string {
		const datePart = new Date().toLocaleDateString('en-GB').split('/').join('-');
		const randomId = Math.floor(Math.random() * 10000);
		return `${datePart}-${randomId}`;
	}

	private getFilePath(): string {
		if (this.options.filePath === 'AUTO' || !this.options.filePath) {
			const logsFolderPath = path.join(process.cwd(), 'logs');
			if (!fs.existsSync(logsFolderPath)) {
				fs.mkdirSync(logsFolderPath, { recursive: true });
			}
			const autoFileName = this.generateAutoFileName();
			return path.join(logsFolderPath, `${autoFileName}.log`);
		}

		return this.options.filePath;
	}

	private logMessage(level: LogLevel, message: string): void {
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

	private logToConsole(level: LogLevel, formattedMessage: string): void {
		switch (level) {
			case LogLevel.SOFT:
				console.log(colors.magenta(formattedMessage));
				break;
			case LogLevel.ERROR:
				console.log(colors.red(formattedMessage));
				break;
			default:
				console.log(formattedMessage);
				break;
		}
	}

	private logToFile(message: string): void {
		const filePath = this.getFilePath();

		try {
			// Create the log file if it doesn't exist
			if (!fs.existsSync(filePath)) {
				fs.writeFileSync(filePath, '');
			}

			fs.appendFileSync(filePath, `${message}\n`, 'utf-8');
		} catch (error) {
			console.error(colors.red(`Error writing LOG files: ${error}`));
		}
	}

	scan(message: string): void {
		this.logMessage(this.options.logLevel, message);
	}
}

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
