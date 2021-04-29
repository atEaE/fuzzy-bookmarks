import * as vscode from 'vscode';
import * as open from 'open';
import * as extsutils from '../utils/extensions';
import * as common from './common';
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

    var concatBk = common.concatBookmark(bookmarksInfo.fileBookmarks, bookmarksInfo.folderBookmarks, bookmarksInfo.urlBookmarks);
    var items = concatBk.map<BookmarkLabel>(b => createBookmarkLabel(b));
    if (items.length === 0) {
        vscode.window.showWarningMessage("Bookmark has not been registered.");
        return;
    }

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


