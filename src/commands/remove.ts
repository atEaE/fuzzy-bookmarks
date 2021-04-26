import * as vscode from 'vscode';
import * as fs from 'fs';
import * as jsonutils from '../utils/json';
import * as fileutils from '../utils/file';
import { FzbConfig } from '../contributes';
import { BookmarksInfo, BookmarkLabel, createBookmarkLabel } from '../models/bookmark';

/**
 * Execute the process of remove command.
 * @param config Fuzzy Bookmark configuration.
 * @returns void
 */
export function removeExecute(config: FzbConfig): void {
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
    var items = bookmarksInfo.bookmarks.map<BookmarkLabel>(b => createBookmarkLabel(b));
    if (items.length === 0) {
        vscode.window.showWarningMessage("Bookmark has not been registered.");
        return;
    }

    var path = fileutils.resolveHome(config.defaultBookmarkFullPath());
    vscode.window.showQuickPick(items, { matchOnDescription: true, matchOnDetail: true }).then((item) => {
        if (!item) return;

        if (bookmarksInfo) {
            bookmarksInfo.bookmarks = bookmarksInfo.bookmarks.filter(b => b.id !== item.id);

            try {
                fs.writeFileSync(path, JSON.stringify(bookmarksInfo), { encoding: "utf-8" });
                vscode.window.showInformationMessage("Bookmark has been removed.");
            } catch (e) {
                vscode.window.showErrorMessage(e.message);
            }
        }
    });
}
