import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as extsutils from '../utils/extensions';
import * as common from './common';
import { IFzbConfig } from '../contributes';
import { IBookmarksInfo } from '../models/bookmark';

/**
 * Execute the process of export command.
 * @param config Fuzzy Bookmark configuration.
 * @returns void
 */
export function exportExecute(config: IFzbConfig): void {
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

  try {
    var currentRootFolder = vscode.workspace.workspaceFolders
      ? vscode.workspace.workspaceFolders[0].uri.path
      : undefined;
    if (currentRootFolder) {
      var exportPath = path.join(currentRootFolder, 'export-bookmarks.json');
      fs.writeFileSync(exportPath, JSON.stringify(bookmarksInfo), { encoding: 'utf-8' });
      vscode.window.showInformationMessage(`Export Success. (${exportPath})`);
    } else {
      vscode.window.showWarningMessage('Directory has not been opened.');
    }
  } catch (e) {
    vscode.window.showErrorMessage(e.message);
  }
}
