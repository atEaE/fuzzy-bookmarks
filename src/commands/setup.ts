// TODO: want to replace it with a testable module.
import * as fs from 'fs';
import * as fileutils from '../utils/file';

// ok
import * as models from '../models';

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
  public execute(_execArgs: models.IVSCodeExecutableArguments, configManager: models.IConfigManager): void {
    this.vscodeManager.window
      .showInputBox({
        // eslint-disable-next-line max-len
        prompt: `Create a file "${configManager.defaultBookmarkFullPath()}" as setup. If you want to continue, enter "y|yes".`,
      })
      .then(input => {
        if (input === 'y' || input === 'yes') {
          try {
            // check folder.
            if (!fs.existsSync(fileutils.resolveHome(configManager.saveDirectoryPath()))) {
              fs.mkdirSync(fileutils.resolveHome(configManager.saveDirectoryPath()));
            }
            this.vscodeManager.window.showInformationMessage(
              'OK! Confirmed the existence of the destination folder.',
            );

            // check file.
            if (!fs.existsSync(fileutils.resolveHome(configManager.defaultBookmarkFullPath()))) {
              var blob = JSON.stringify(this.bookmarkManager.cerateBookmarksInfo());
              fs.writeFileSync(fileutils.resolveHome(configManager.defaultBookmarkFullPath()), blob);
            }
            this.vscodeManager.window.showInformationMessage(
              'OK! Confirmed the existence of the destination file.',
            );
            this.vscodeManager.window.showInformationMessage('Setup completed🎉');
          } catch (e) {
            this.vscodeManager.window.showErrorMessage('An error occurred during setup.' + e.message);
          }
        } else {
          this.vscodeManager.window.showWarningMessage('Abort setup.');
        }
      });
  }
}
