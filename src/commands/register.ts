import * as vscode from 'vscode';
import * as fs from 'fs';
import * as fileutils from '../utils/file';
import { FzbConfig } from '../contributes';
import { BookmarksInfo, BookmarkLabel, Bookmark, FORMAT_VERSION } from '../models/bookmark';

/**
 * Execute the process of register command.
 * @param config Fuzzy Bookmark configuration.
 * @returns void
 */
export function registerExecute(config: FzbConfig): void {
    try {
        var [ok, reason] = config.validate();
        if (!ok) {
            vscode.window.showWarningMessage(reason.error);
            return;
        }

        if (fs.existsSync(fileutils.resolveHome(config.defaultBookmarkFullPath()))) {
            var stats: fs.Stats = fs.statSync(fileutils.resolveHome(config.defaultBookmarkFullPath()));
            if (stats.isDirectory()) {
                vscode.window.showWarningMessage(`${config.defaultBookmarkFullPath()} is a directory. Please specify a file.`);
                return;
            }
        }

        var bookmarks: BookmarksInfo = { version: FORMAT_VERSION, bookmarks: [] };

    } catch (e) {
        vscode.window.showErrorMessage(e);
        return;
    }
}

