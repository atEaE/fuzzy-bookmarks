import * as vscode from 'vscode';
import * as fs from 'fs';
import * as extsutils from '../utils/extensions';
import * as fileutils from '../utils/file';
import * as common from './common';
import { FzbConfig } from '../contributes';
import { Bookmark, BookmarksInfo, createBookmark } from '../models/bookmark';

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

    // load file
    var bookmarksInfo: BookmarksInfo;
    try {
        bookmarksInfo = common.loadBookmarksInfo(config);
    } catch (e) {
        if (e instanceof extsutils.FzbExtensionsError) {
            vscode.window.showWarningMessage(e.message);
            return;
        } else {
            throw e;
        }
    }

    var path = fileutils.resolveHome(config.defaultBookmarkFullPath());
    vscode.window.showInputBox()
        .then(input => {
            if (!input) {
                return;
            }

            var bk = identifyInput(input);
            if (!bk) {
                vscode.window.showWarningMessage("Sorry.. Unable to identify your input. ");
                return;
            }

            switch (bk.type) {
                case "file":
                    bookmarksInfo?.fileBookmarks.push(bk);
                    break;
                case "folder":
                    bookmarksInfo?.folderBookmarks.push(bk);
                    break;
                case "url":
                    bookmarksInfo?.urlBookmarks.push(bk);
                    break;
                default:
                    vscode.window.showWarningMessage("Sorry.. Unable to identify your input. ");
                    return;
            }

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
        return createBookmark("url", input);
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
                return createBookmark("folder", input);
            } else {
                return createBookmark("file", input);
            }
        } else {
            return undefined;
        }
    } catch {
        return undefined;
    }
}
