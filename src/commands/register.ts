import * as vscode from 'vscode';
import * as fs from 'fs';
import * as jsonutils from '../utils/json';
import * as fileutils from '../utils/file';
import { FzbConfig } from '../contributes';
import { Bookmark, BookmarksInfo } from '../models/bookmark';

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

    var path = fileutils.resolveHome(config.defaultBookmarkFullPath());
    vscode.window.showInputBox()
        .then(input => {
            if (!input) {
                return;
            }

            var bk = identifyInput(input);
            if (!bk) {
                vscode.window.showWarningMessage("Sorry.. Unable to identify your input. ")
                return;
            }

            bookmarksInfo?.bookmarks.push(bk);
            try {
                fs.writeFileSync(path, JSON.stringify(bookmarksInfo), { encoding: "utf-8" });
                vscode.window.showInformationMessage("Bookmarking is complete🔖");
            } catch (e) {
                vscode.window.showErrorMessage(e.message);
            }
        });
}

/**
 * It identifies the input and creates a Bookmark based on the content.
 * @param input user input
 * @returns bookmark
 */
function identifyInput(input: string): Bookmark | undefined {
    var maybe = identifyURLInput(input);
    if (maybe) {
        return maybe;
    }

    maybe = identifyFileInput(input);
    if (maybe) {
        return maybe;
    }

    return undefined;
}

/**
 * Determines if the input is a URL-type Bookmark.
 * @param input user input
 * @returns maybe bookmark
 */
function identifyURLInput(input: string): Bookmark | undefined {
    if (input.startsWith("http://") || input.startsWith("https://")) {
        return { type: "url", detail: input };
    }
    return undefined;
}

/**
 * Determines if the input is a File-type or Folder-type Bookmark.
 * @param input user input
 * @returns maybe bookmark
 */
function identifyFileInput(input: string): Bookmark | undefined {
    try {
        if (fs.existsSync(input)) {
            var stat = fs.statSync(input);
            if (stat.isDirectory()) {
                return { type: "folder", detail: input };
            } else {
                return { type: "file", detail: input };
            }
        } else {
            return undefined;
        }
    } catch {
        return undefined;
    }
}
