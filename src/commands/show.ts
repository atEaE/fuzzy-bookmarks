import * as vscode from 'vscode';
import * as open from 'open';
import * as extsutils from '../utils/extensions';
import * as fileutils from '../utils/file';
import * as common from './common';
import { IFzbConfig } from '../contributes';
import { IBookmarksInfo, IBookmarkLabel, createBookmarkLabel } from '../models/bookmark';

/**
 * Refer to the files registered in Bookmark.
 * @param config Fuzzy Bookmark configuration.
 * @param description bookmark description.
 */
function showFile(_: IFzbConfig, description: string | undefined) {
  if (description) {
    var path = fileutils.resolveHome(description);
    vscode.window.showTextDocument(vscode.Uri.file(path), {
      preview: false,
    });
  }
}

/**
 * Refer to the folder registered in Bookmark.
 * @param config Fuzzy Bookmark configuration.
 * @param description bookmark description.
 */
function showFolder(config: IFzbConfig, description: string | undefined) {
  if (description) {
    var path = fileutils.resolveHome(description);
    switch (config.directoryOpenType()) {
      case 'terminal':
        // eslint-disable-next-line max-len
        // refs: https://github.com/microsoft/vscode/blob/94c9ea46838a9a619aeafb7e8afd1170c967bb55/src/vs/workbench/contrib/externalTerminal/browser/externalTerminal.contribution.ts#L30-L83
        vscode.commands.executeCommand('openInTerminal', vscode.Uri.file(path));
        break;
      case 'explorer':
        open(path);
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
function showUrl(_: IFzbConfig, description: string | undefined) {
  if (description) {
    open(description);
  }
}

/**
 * Execute the process of show command.
 * @param config Fuzzy Bookmark configuration.
 * @returns void
 */
export function showExecute(config: IFzbConfig): void {
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

  vscode.window.showQuickPick(items, { matchOnDescription: true, matchOnDetail: true }).then(item => {
    if (!item) {
      return;
    }

    switch (item.type) {
      case 'file':
        showFile(config, item.description);
        break;
      case 'folder':
        showFolder(config, item.description);
        break;
      case 'url':
        showUrl(config, item.description);
        break;
      default:
        break;
    }
  });
}
