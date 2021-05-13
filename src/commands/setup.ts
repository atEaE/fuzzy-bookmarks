// TODO: want to replace it with a testable module.
import * as fs from 'fs';
import * as fileutils from '../utils/file';

// ok
import * as models from '../models';

const _empty = '';

/**
 * Setup command.
 */
export class Setup implements models.ICommand {
  constructor(private vscodeManager: models.IVSCodeManager, private bookmarkManager: models.IBookmarkManager) {}

  /**
   * Return the command name.
   * @returns command name.
   */
  public name(): string {
    return 'fzb.setupBookmarks';
  }

  /**
   * Execute.
   */
  public async execute(_execArgs: models.IVSCodeExecutableArguments, configManager: models.IConfigManager) {
    var input = await this.vscodeManager.window.showInputBox({
      // eslint-disable-next-line max-len
      prompt: `Create a file "${configManager.defaultBookmarkFullPath()}" as setup. If you want to continue, enter "y|yes".`,
    });
    if (input !== 'y' && input !== 'yes') {
      this.vscodeManager.window.showWarningMessage('Abort setup.');
      return;
    }
    this.mainProcess(configManager = configManager);
  }

  /**
   * setup main process
   * @param configManager configuration manager
   */
  private mainProcess(configManager: models.IConfigManager): void {
    try {
      var root = this.vscodeManager.currentRootFolder;
      root = root ? root : _empty;

      // check folder.
      var dirPath = fileutils.resolveToAbsolute(root, configManager.saveDirectoryPath());
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
      }
      this.vscodeManager.window.showInformationMessage('OK! Confirmed the existence of the destination folder.');

      // check file.
      var bookmarksPath = fileutils.resolveToAbsolute(root, configManager.defaultBookmarkFullPath());
      if (!fs.existsSync(bookmarksPath)) {
        var blob = JSON.stringify(this.bookmarkManager.cerateBookmarksInfo());
        fs.writeFileSync(bookmarksPath, blob);
      }
      this.vscodeManager.window.showInformationMessage('OK! Confirmed the existence of the destination file.');
      this.vscodeManager.window.showInformationMessage('Setup completed🎉');
    } catch (e) {
      this.vscodeManager.window.showErrorMessage('An error occurred during setup.' + e.message);
    }
  }
}
