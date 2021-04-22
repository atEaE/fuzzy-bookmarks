import * as path from 'path';
import * as os from 'os';

/**
 * Returns the file path with the reference resolution to the HOME directory.
 * @param filepath filepath
 * @returns File path after name resolution
 */
export function resolveHome(filepath: string | undefined | null): string {
    if (!filepath) {
        return "";
    }

    if (filepath[0] === '~') {
        return path.join(os.homedir(), filepath.slice(1));
    }
    return filepath;
}