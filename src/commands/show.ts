import * as vscode from 'vscode';
import * as workbench from 'vscode';
import * as webview from 'open';
import * as fs from 'fs';
import * as fileutils from '../utils/file';
import { FzbConfig } from '../contributes';
import { BookmarksInfo, BookmarkLabel, createBookmarkLabel } from '../models/bookmark';

/**
 * 
 * @param config Fuzzy Bookmark configuration.
 * @returns void
 */
export function showExecute(config: FzbConfig): void {
    var items: BookmarkLabel[] = [];
    try {
        var [ok, reason] = config.validate();
        if (!ok) {
            vscode.window.showWarningMessage(reason.error);
            return;
        }

        var bookmarkPath = fileutils.resolveHome(config.defaultBookmarkFullPath());
        var buff = fs.readFileSync(bookmarkPath, "utf-8");
        var bookmarks = JSON.parse(buff) as BookmarksInfo;
        items = bookmarks.bookmarks.map<BookmarkLabel>(b => createBookmarkLabel(b));
    } catch (e) {
        vscode.window.showErrorMessage(e);
        return;
    }

    vscode.window.showQuickPick(items, { matchOnDescription: true, matchOnDetail: true }).then((item) => {
        if (!item) { return; }

        switch (item.type) {
            case "file":
                showFile(item.description);
            case "folder":
                showFolder(item.description);
            case "url":
                showUrl(item.description);
            default:
                return;
        }
    });
}

/**
 * Refer to the files registered in Bookmark.
 * @param description bookmark description.
 */
function showFile(description: string | undefined) {
    if (description) {
        vscode.window.showTextDocument(vscode.Uri.file(description), {
            preview: false,
        });
    }
}

/**
 * Refer to the folder registered in Bookmark.
 * @param description bookmark description.
 */
function showFolder(description: string | undefined) {
    if (description) {
        vscode.commands.executeCommand("revealFileInOS", description);
    }
}

/**
 * Refer to the URL registered in Bookmark.
 * @param description bookmark description.
 */
function showUrl(description: string | undefined) {
    if (description) {
        webview(description);
    }
}


