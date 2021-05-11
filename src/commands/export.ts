// TODO: want to replace it with a testable module.
import * as fs from 'fs';
import * as path from 'path';

// ok
import * as models from '../models';

/**
 * Export command.
 */
export class Export implements models.ICommand {
  constructor(private vscodeManager: models.IVSCodeManager, private bookmarkManager: models.IBookmarkManager) {}

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
  public execute(_execArgs: models.IVSCodeExecutableArguments, configManager: models.IConfigManager): void {
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
      bookmarksInfo = this.bookmarkManager.loadBookmarksInfo(fullPath ? fullPath : '');
    } catch (e) {
      this.vscodeManager.window.showWarningMessage(e.message);
      return;
    }

    try {
      var root = this.vscodeManager.currentRootFolder;

      if (root) {
        var exportPath = path.join(root.path, 'export-bookmarks.json');
        fs.writeFileSync(exportPath, JSON.stringify(bookmarksInfo), {
          encoding: 'utf-8',
        });
        this.vscodeManager.window.showInformationMessage(`Export Success. (${exportPath})`);
      } else {
        this.vscodeManager.window.showWarningMessage(`Directory has not been opened.`);
      }
    } catch (e) {
      this.vscodeManager.window.showErrorMessage(e.message);
    }
  }
}
