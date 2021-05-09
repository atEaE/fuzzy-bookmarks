import * as fs from 'fs';
import * as fileutils from '../utils/file';

// ok
import * as models from '../models';

/**
 * Setup command.
 */
export class Setup implements models.ICommand {
  constructor(
    private vscodeManager: models.IVSCodeManager,
    private bookmarkManager: models.IBookmarkManager,
  ) {}

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
  public execute(
    _execArgs: models.IVSCodeExecutableArguments,
    configManager: models.IConfigManager,
    _bookMarkManager: models.IBookmarkManager,
  ): void {
    this.vscodeManager.window
      .showInputBox({
        // eslint-disable-next-line max-len
        prompt: `Create a file "${configManager.defaultBookmarkFullPath()}" as setup. If you want to continue, enter "y|yes".`,
      })
      .then(input => {
        if (input === 'y' || input === 'yes') {
          try {
            // check folder.
            if (
              fs.existsSync(
                fileutils.resolveHome(configManager.saveDirectoryPath()),
              )
            ) {
              this.vscodeManager.window.showInformationMessage(
                'OK! Confirmed the existence of the destination folder.',
              );
            } else {
              fs.mkdirSync(
                fileutils.resolveHome(configManager.saveDirectoryPath()),
              );
              // eslint-disable-next-line max-len
              this.vscodeManager.window.showInformationMessage(
                `OK! Create a new destination folder(${configManager.saveDirectoryPath()}).`,
              );
            }

            // check file.
            if (
              fs.existsSync(
                fileutils.resolveHome(configManager.defaultBookmarkFullPath()),
              )
            ) {
              this.vscodeManager.window.showInformationMessage(
                'OK! Confirmed the existence of the destination file.',
              );
            } else {
              var blob = JSON.stringify(
                this.bookmarkManager.cerateBookmarksInfo(),
              );
              fs.writeFileSync(
                fileutils.resolveHome(configManager.defaultBookmarkFullPath()),
                blob,
              );
              this.vscodeManager.window.showInformationMessage(
                `OK! Create a new destination folder(${configManager.defaultBookmarkFullPath()}).`,
              );
            }
            this.vscodeManager.window.showInformationMessage(
              'Setup completed! ',
            );
          } catch (e) {
            this.vscodeManager.window.showErrorMessage(
              'An error occurred during setup.' + e.message,
            );
          }
        } else {
          this.vscodeManager.window.showWarningMessage('Abort setup.');
        }
      });
  }
}
