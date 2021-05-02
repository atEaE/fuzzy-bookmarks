import * as vscode from 'vscode';
import * as fs from 'fs';
import * as extsutils from '../utils/extensions';
import * as fileutils from '../utils/file';
import * as common from './common';
import { IFzbConfig } from '../contributes';
import { IBookmarksInfo, IBookmarkLabel, createBookmarkLabel } from '../models/bookmark';

/**
 * Execute the process of remove command.
 * @param config Fuzzy Bookmark configuration.
 * @returns void
 */
export function removeExecute(config: IFzbConfig): void {
  var [ok, reason] = config.validate();
  if (!ok) {
    vscode.window.showWarningMessage(reason.error);
    return;
  }

  // load file
  var bookmarksInfo: IBookmarksInfo;
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

  var concatBk = common.concatBookmark(
    bookmarksInfo.fileBookmarks,
    bookmarksInfo.folderBookmarks,
    bookmarksInfo.urlBookmarks,
  );
  var items = concatBk.map<IBookmarkLabel>(b => createBookmarkLabel(b));
  if (items.length === 0) {
    vscode.window.showWarningMessage('Bookmark has not been registered.');
    return;
  }

  var path = fileutils.resolveHome(config.defaultBookmarkFullPath());
  vscode.window
    .showQuickPick(items, { matchOnDescription: true, matchOnDetail: true, canPickMany: true })
    .then(selected => {
      if (!selected || selected.length === 0) {
        return;
      }

      selected.forEach(item => {
        if (bookmarksInfo) {
          switch (item.type) {
            case 'file':
              bookmarksInfo.fileBookmarks = bookmarksInfo.fileBookmarks.filter(b => b.id !== item.id);
              break;
            case 'folder':
              bookmarksInfo.folderBookmarks = bookmarksInfo.folderBookmarks.filter(b => b.id !== item.id);
              break;
            case 'url':
              bookmarksInfo.urlBookmarks = bookmarksInfo.urlBookmarks.filter(b => b.id !== item.id);
              break;
            default:
              break;
          }
        }
      });

      try {
        fs.writeFileSync(path, JSON.stringify(bookmarksInfo), { encoding: 'utf-8' });
        vscode.window.showInformationMessage('Bookmark has been removed.');
      } catch (e) {
        vscode.window.showErrorMessage(e.message);
        return;
      }
    });
}
