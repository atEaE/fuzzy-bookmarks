import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { IFzbConfig } from '../contributes';

// ok
import * as models from '../models';
import { CommandBase } from './base';
import { ExtensionCommandError } from './extensionCommandError';

/**
 * Export command.
 */
export class Export extends CommandBase {
  constructor(private vs: models.IVSCode, bookmarkManager: models.IBookmarkManager) {
    super(bookmarkManager);
  }

  /**
   * Return the command name.
   * @returns command name.
   */
  public name(): string {
    return 'fzb.exportBookmarks';
  }

  /**
   * Execute.
   */
  public execute(_: models.IVSCodeExecutableArguments): void {
    // load file
    var bookmarksInfo: models.IBookmarksInfo;
    try {
      bookmarksInfo = this.loadBookmarksInfo(config);
    } catch (e) {
      if (e instanceof ExtensionCommandError) {
        vscode.window.showWarningMessage(e.message);
        return;
      } else {
        throw e;
      }
    }

    try {
      var currentRootFolder = this.vs.workspace.workspaceFolders
        ? this.vs.workspace.workspaceFolders[0].uri.path
        : undefined;

      if (currentRootFolder) {
        var exportPath = path.join(currentRootFolder, 'export-bookmarks.json');
        fs.writeFileSync(exportPath, JSON.stringify(bookmarksInfo), { encoding: 'utf-8' });
        this.vs.window.showInformationMessage(`Export Success. (${exportPath})`);
      } else {
        this.vs.window.showWarningMessage(`Directory has not been opened.`);
      }
    } catch (e) {
      this.vs.window.showErrorMessage(e.message);
    }
  }
}

/**
 * Execute the process of export command.
 * @param config Fuzzy Bookmark configuration.
 * @returns void

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
 */
