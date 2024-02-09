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
export declare function env(advanced?: boolean): EnvironmentFileInformation;
export {};
