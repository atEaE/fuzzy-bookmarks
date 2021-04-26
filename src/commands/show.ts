import * as vscode from 'vscode';
import * as open from 'open';
import * as jsonutils from '../utils/json';
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
        items.push({ id: "---", type: "nil", label: "$(issues)", description: "Does not exist bookmarks." });
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
            case "nil":
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


