import * as vscode from 'vscode';
import * as open from 'open';
import * as fs from 'fs';
import * as fileutils from '../utils/file';
import { FzbConfig } from '../contributes';
import { BookmarksInfo, BookmarkLabel, createBookmarkLabel } from '../models/bookmark';

/**
 * Execute the process of register command.
 * @param config Fuzzy Bookmark configuration.
 * @returns void
 */
export function registerExecute(config: FzbConfig): void {
    var items: BookmarkLabel[] = [];
    try {
        var [ok, reason] = config.validate();
        if (!ok) {
            vscode.window.showWarningMessage(reason.error);
            return;
        }
    } catch (e) {
        vscode.window.showErrorMessage(e);
        return;
    }
}

