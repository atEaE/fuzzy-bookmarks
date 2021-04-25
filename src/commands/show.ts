import * as vscode from 'vscode';
import * as open from 'open';
import * as fs from 'fs';
import * as fileutils from '../utils/file';
import { FzbConfig } from '../contributes';
import { BookmarksInfo, BookmarkLabel, createBookmarkLabel } from '../models/bookmark';

/**
 * Execute the process of show command.
 * @param config Fuzzy Bookmark configuration.
 * @returns void
 */
export function showExecute(config: FzbConfig): void {
    var [ok, reason] = config.validate();
    if (!ok) {
        vscode.window.showWarningMessage(reason.error);
        return;
    }

    var bookmarkPath = fileutils.resolveHome(config.defaultBookmarkFullPath());
    var buff = fs.readFileSync(bookmarkPath, "utf-8");
    var bookmarks = JSON.parse(buff) as BookmarksInfo;
    var items = bookmarks.bookmarks.map<BookmarkLabel>(b => createBookmarkLabel(b));

    vscode.window.showQuickPick(items, { matchOnDescription: true, matchOnDetail: true }).then((item) => {
        if (!item) { return; }

        switch (item.type) {
            case "file":
                showFile(config, item.description);
                break;
            case "folder":
                showFolder(config, item.description);
                break;
            case "url":
                showUrl(config, item.description);
                break;
            default:
                break;;
        }
    });
}

/**
 * Refer to the files registered in Bookmark.
 * @param config Fuzzy Bookmark configuration.
 * @param description bookmark description.
 */
function showFile(config: FzbConfig, description: string | undefined) {
    if (description) {
        vscode.window.showTextDocument(vscode.Uri.file(description), {
            preview: false,
        });
    }
}

/**
 * Refer to the folder registered in Bookmark.
 * @param config Fuzzy Bookmark configuration.
 * @param description bookmark description.
 */
function showFolder(config: FzbConfig, description: string | undefined) {
    if (description) {
        switch (config.directoryOpenType()) {
            case "terminal":
                vscode.commands.executeCommand("openInTerminal", vscode.Uri.file(description));
                break;
            case "explorer":
                open(description);
                break;
            default:
                break;
        }
    }
}

/**
 * Refer to the URL registered in Bookmark.
 * @param config Fuzzy Bookmark configuration.
 * @param description bookmark description.
 */
function showUrl(config: FzbConfig, description: string | undefined) {
    if (description) {
        open(description);
    }
}


