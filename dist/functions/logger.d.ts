export declare enum LogLevel {
    SOFT = "soft",
    ERROR = "error"
}
interface LoggerOptions {
    logLevel: LogLevel;
    enableTimestamp: boolean;
    timeZone: string;
    dateFormat: string;
    showLogLevel: boolean;
    enableConsole: boolean;
    writeToFile: boolean;
    filePath?: string;
}
export declare class L {
    private options;
    constructor(options?: Partial<LoggerOptions>);
    private getCurrentTimestamp;
    private generateAutoFileName;
    private getFilePath;
    private logMessage;
    private logToConsole;
    private logToFile;
    scan(message: string): void;
}
export {};
