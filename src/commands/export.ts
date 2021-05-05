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
  constructor(private vscodeManager: models.IVSCodeManager, bookmarkManager: models.IBookmarkManager) {
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
  public execute(
    _execArgs: models.IVSCodeExecutableArguments,
    configManager: models.IConfigManager,
    _bookMarkManager: models.IBookmarkManager
  ): void {
    // validate cofiguration.
    var [ok, reason] = configManager.validate();
    if (!ok) {
      this.vscodeManager.window.showWarningMessage(reason.error);
      return;
    }

    // load file
    var bookmarksInfo: models.IBookmarksInfo;
    try {
      let fullPath = configManager.defaultBookmarkFullPath();
      bookmarksInfo = this.loadBookmarksInfo(fullPath ? fullPath : '');
    } catch (e) {
      if (e instanceof ExtensionCommandError) {
        this.vscodeManager.window.showWarningMessage(e.message);
        return;
      } else {
        throw e;
      }
    }

    try {
      var currentRootFolder = this.vscodeManager.workspace.workspaceFolders
        ? this.vscodeManager.workspace.workspaceFolders[0].uri.path
        : undefined;

      if (currentRootFolder) {
        var exportPath = path.join(currentRootFolder, 'export-bookmarks.json');
        fs.writeFileSync(exportPath, JSON.stringify(bookmarksInfo), { encoding: 'utf-8' });
        this.vscodeManager.window.showInformationMessage(`Export Success. (${exportPath})`);
      } else {
        this.vscodeManager.window.showWarningMessage(`Directory has not been opened.`);
      }
    } catch (e) {
      this.vscodeManager.window.showErrorMessage(e.message);
    }
  }
}
