import * as vscode from 'vscode';
import * as fs from 'fs';
import * as jsonutils from '../utils/json';
import * as fileutils from '../utils/file';
import { FzbConfig } from '../contributes';
import { Bookmark, BookmarksInfo, FORMAT_VERSION } from '../models/bookmark';

/**
 * Execute the process of register command.
 * @param config Fuzzy Bookmark configuration.
 * @returns void
 */
export function registerExecute(config: FzbConfig): void {
    var [ok, reason] = config.validate();
    if (!ok) {
        vscode.window.showWarningMessage(reason.error);
        return;
    }

    var blob = fileutils.safeReadFileSync(fileutils.resolveHome(config.defaultBookmarkFullPath()), "utf-8");
    if (!blob) {
        vscode.window.showErrorMessage(`Failed to load "${config.defaultBookmarkFullPath()}". Please check the existence of the file.`);
        return;
    }
    var bookmarksInfo = jsonutils.safeParse<BookmarksInfo>(blob);
    if (!bookmarksInfo) {
        vscode.window.showErrorMessage(`Failed to load "${config.defaultBookmarkFullPath()}". The format is different from what is expected.`);
        return;
    }

    vscode.window.showInputBox()
        .then(input => {
            if (!input) {
                return;
            }

            var bk = identifyInput(input);
            bookmarksInfo?.bookmarks.push(bk);
            var path = fileutils.resolveHome(config.defaultBookmarkFullPath());
            if (path) {
                try {
                    fs.writeFileSync(path, JSON.stringify(bookmarksInfo), { encoding: "utf-8" });
                    vscode.window.showInformationMessage("Bookmarking is complete🔖");
                } catch (e) {
                    vscode.window.showErrorMessage(e.message);
                }
            }
        });
}

function identifyInput(input: string): Bookmark {
    var maybe = identifyURLInput(input);
    if (maybe) {
        return maybe;
    }

    return { type: "unknown", detail: input };
}

function identifyURLInput(input: string): Bookmark | undefined {
    if (input.startsWith("http://") || input.startsWith("https://")) {
        return { type: "url", detail: input };
    }
    return undefined;
}

