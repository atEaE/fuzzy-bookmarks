import * as vscode from 'vscode';

/**
 * Contributes commands.
 */
export namespace ContributesCommands {
    export const SEARCH_BOOKMARKS = "fzb.searchBookmarks";
}

/**
 * Contributes configuration.
 */
export namespace ContributesConfig {
    const CONFIG_CATEGORY = "fzb";
    const DEFAULT_PATH = "defaultBookmarkPath";

    export const CONFIG_KEY = {
        DEFAULT_PATH: CONFIG_CATEGORY + "." + DEFAULT_PATH
    };

    class FzbConfig {
        config: vscode.WorkspaceConfiguration;
        constructor(config: vscode.WorkspaceConfiguration) {
            this.config = config;
        }

        public globalPath(): string | undefined {
            return this.config.get(DEFAULT_PATH);
        }
    }

    export function getFzBConfig(): FzbConfig {
        return new FzbConfig(vscode.workspace.getConfiguration(CONFIG_CATEGORY));
    };
}