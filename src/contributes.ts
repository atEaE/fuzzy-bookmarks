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
    const CONFIG_CATEGORY = "fzb"
    const GLOBAL_PATH = "globalBookmarkPath"

    export const CONFIG_KEY = {
        GLOBAL_PATH: CONFIG_CATEGORY + "." + GLOBAL_PATH
    }

    class FzbConfig {
        config: vscode.WorkspaceConfiguration
        constructor(config: vscode.WorkspaceConfiguration) {
            this.config = config
        }

        public globalPath(): string | undefined {
            return this.config.get(GLOBAL_PATH)
        }
    }

    export function getFzBConfig(): FzbConfig {
        return new FzbConfig(vscode.workspace.getConfiguration(CONFIG_CATEGORY))
    };
}