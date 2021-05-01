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
        .then(detail => {
            if (!detail) {
                return;
            }
            vscode.window.showInputBox({ prompt: "Enter arias. You can also skip this step." })
                .then(alias => {
                    var bk = identifyInput(detail, alias);
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
                })
        });
}

/**
 * It identifies the input and creates a Bookmark based on the content.
 * @param detail user input detail
 * @param alias user input alias
 * @returns bookmark
 */
function identifyInput(detail: string, alias: string | undefined): Bookmark | undefined {
    var maybe = identifyURLInput(detail, alias);
    if (maybe) {
        return maybe;
    }

    maybe = identifyFileInput(detail, alias);
    if (maybe) {
        return maybe;
    }

    return undefined;
}

/**
 * Determines if the input is a URL-type Bookmark.
 * @param detail user input detail
 * @param alias user input alias
 * @returns maybe bookmark
 */
function identifyURLInput(detail: string, alias: string | undefined): Bookmark | undefined {
    if (detail.startsWith("http://") || detail.startsWith("https://")) {
        return createBookmark("url", detail, alias);
    }
    return undefined;
}

/**
 * Determines if the input is a File-type or Folder-type Bookmark.
 * @param detail user input detail
 * @param alias user input alias
 * @returns maybe bookmark
 */
function identifyFileInput(detail: string, alias: string | undefined): Bookmark | undefined {
    try {
        var path = fileutils.resolveHome(detail);
        if (fs.existsSync(path)) {
            var stat = fs.statSync(path);
            if (stat.isDirectory()) {
                return createBookmark("folder", detail, alias);
            } else {
                return createBookmark("file", detail, alias);
            }
        } else {
            return undefined;
        }
    } catch {
        return undefined;
    }
}
