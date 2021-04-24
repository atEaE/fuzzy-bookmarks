import * as vscode from 'vscode';
import * as path from 'path';
import { InValidReason, ValidateObject } from './utils/validate';

/**
 * Fuzzy Bookmark configuration.
 */
export interface FzbConfig extends ValidateObject {
    defaultDir(): string | undefined
    defaultFileName(): string | undefined
    defaultBookmarkFullPath(): string | undefined
    directoryOpenType(): DirectoryOpenType | undefined
    validate(): [boolean, InValidReason]
}

/**
 * Contributes commands.
 */
export namespace ContributesCommands {
    export const SEARCH_BOOKMARKS = "fzb.searchBookmarks";
}

/**
 * Directory open type.
 */
type DirectoryOpenType = "terminal" | "explorer";

/**
 * Contributes configuration.
 */
export namespace ContributesConfig {
    const CONFIG_CATEGORY = "fzb";
    const DEFAULT_DIR = "defaultBookmarkDir";
    const DEFAULT_FILENAME = "defaultBookmarkFileName";
    const DIRECTORY_OPEN_TYPE = "directoryOpenType";

    /**
     * Key names for settings that can be configured in Fuzzy Bookmarks
     */
    export const CONFIG_KEY = {
        defaultDir: CONFIG_CATEGORY + "." + DEFAULT_DIR,
        defaultFileName: CONFIG_CATEGORY + "." + DEFAULT_FILENAME,
        directoryOpenType: CONFIG_CATEGORY + "." + DIRECTORY_OPEN_TYPE,
    };

    /**
     * Fuzzy Bookmark configuration class.
     */
    class FzbConfig {
        config: vscode.WorkspaceConfiguration;
        constructor(config: vscode.WorkspaceConfiguration) {
            this.config = config;
        }

        /**
         * Returns the default directory path to save the bookmark.
         * @returns defaultBookmarkDir
         */
        public defaultDir(): string | undefined {
            return this.config.get(DEFAULT_DIR);
        }

        /**
         * Returns the default file name where the bookmarks are saved.
         * @returns defaultFileName
         */
        public defaultFileName(): string | undefined {
            return this.config.get(DEFAULT_FILENAME);
        }

        /**
         * Returns the Open method of the directory.
         * @returns open type.
         */
        public directoryOpenType(): DirectoryOpenType | undefined {
            return this.config.get(DIRECTORY_OPEN_TYPE);
        }

        /**
         * Returns the full path of the Bookmark file.
         * @returns bookmarkFullPath
         */
        public defaultBookmarkFullPath(): string | undefined {
            var dir = this.defaultDir();
            var file = this.defaultFileName();
            if (dir && file) {
                return path.join(dir, file);
            }
            return undefined;
        }

        /**
         * Evaluate the validity of Fuzzy Bookmark setting information.
         */
        public validate(): [boolean, InValidReason] {
            // check default dir
            if (!this.defaultDir()) {
                return [false, { error: `Set the directory path where Bookmarks will be stored to "${CONFIG_KEY.defaultDir}" .` }];
            }


            if (!this.defaultFileName()) {
                return [false, { error: `Set the file name for saving bookmarks to "${CONFIG_KEY.defaultFileName}" .` }];
            }

            return [true, { error: "" }];
        }
    }

    /**
     * Get the configuration for Fuzzy Bookmarks.
     * @returns FzbConfig
     */
    export function getFzBConfig(): FzbConfig {
        return new FzbConfig(vscode.workspace.getConfiguration(CONFIG_CATEGORY));
    };
}