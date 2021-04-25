import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';

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

/**
 * Synchronously reads the entire contents of a file.
 * Does not throw an Error when the file fails to load.
 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
 * URL support is _experimental_.
 * @param options Either the encoding for the result, or an object that contains the encoding and an optional flag.
 * If a flag is not provided, it defaults to `'r'`.
 * @returns body
 */
export function safeReadFileSync(path: number | fs.PathLike, options: { encoding: string; flag?: string; } | string): string | undefined {
    try {
        return fs.readFileSync(path, options)
    } catch {
        return undefined
    }
}