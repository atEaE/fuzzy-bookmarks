import * as vscode from 'vscode';
import * as webview from 'open';
import * as fs from 'fs';
import * as path from 'path';
import * as fileutils from '../utils/file';
import { BookmarksInfo, BookmarkLabel, createPickItem } from '../models/bookmark';

export function searchExecute(defaultPath: string) {
    var items: BookmarkLabel[]
    try {
        if (!defaultPath) {
            defaultPath = "~/.vscode/fzb"
        }
        var bookmarkPath = fileutils.resolveHome(path.join(defaultPath, "bookmarks.json"));

        var buff = fs.readFileSync(bookmarkPath, "utf-8")

        var bookmarks = JSON.parse(buff) as BookmarksInfo
        items = bookmarks.bookmarks.map<BookmarkLabel>(b => createPickItem(b))
    } catch (e) {
        vscode.window.showErrorMessage(e);
        return;
    }

    var options: vscode.QuickPickOptions = { matchOnDescription: true, matchOnDetail: true };
    vscode.window.showQuickPick(items, options).then((item) => {
        if (!item) {
            return
        }

        switch (item.type) {
            case "file":
                if (item.description) {
                    vscode.window.showTextDocument(vscode.Uri.file(item.description), {
                        preview: false,
                    })
                }
            case "url":
                if (item.description) {
                    webview(item.description);
                }
            default:
                return;
        }
    });
}