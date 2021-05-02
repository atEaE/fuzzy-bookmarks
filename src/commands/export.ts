import * as fs from 'fs';
import * as path from 'path';

// ok
import * as models from '../models';
import { CommandBase } from './base';
import { ExtensionCommandError } from './extensionCommandError';

/**
 * Export command.
 */
export class Export extends CommandBase {
  constructor(private vscode: models.IVSCode, bookmarkManager: models.IBookmarkManager) {
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
  public execute(_: models.IVSCodeExecutableArguments, configManager: models.IConfigManager): void {
    // validate cofiguration.
    var [ok, reason] = configManager.validate();
    if (!ok) {
      this.vscode.window.showWarningMessage(reason.error);
      return;
    }

    // load file
    var bookmarksInfo: models.IBookmarksInfo;
    try {
      let fullPath = configManager.defaultBookmarkFullPath();
      bookmarksInfo = this.loadBookmarksInfo(fullPath ? fullPath : '');
    } catch (e) {
      if (e instanceof ExtensionCommandError) {
        this.vscode.window.showWarningMessage(e.message);
        return;
      } else {
        throw e;
      }
    }

    try {
      var currentRootFolder = this.vscode.workspace.workspaceFolders
        ? this.vscode.workspace.workspaceFolders[0].uri.path
        : undefined;

      if (currentRootFolder) {
        var exportPath = path.join(currentRootFolder, 'export-bookmarks.json');
        fs.writeFileSync(exportPath, JSON.stringify(bookmarksInfo), { encoding: 'utf-8' });
        this.vscode.window.showInformationMessage(`Export Success. (${exportPath})`);
      } else {
        this.vscode.window.showWarningMessage(`Directory has not been opened.`);
      }
    } catch (e) {
      this.vscode.window.showErrorMessage(e.message);
    }
  }
}
