import * as fs from 'fs';
import * as fileutils from '../utils/file';

// ok
import * as models from '../models';
import { CommandBase } from './base';

/**
 * Setup command.
 */
export class Setup extends CommandBase {
  constructor(private vscodeManager: models.IVSCodeManager, bookmarkManager: models.IBookmarkManager) {
    super(bookmarkManager);
  }

  /**
   * Return the command name.
   * @returns command name.
   */
  public name(): string {
    return 'fzb.setupBookmark';
  }

  /**
   * Execute.
   */
  public execute(
    _execArgs: models.IVSCodeExecutableArguments,
    configManager: models.IConfigManager,
    _bookMarkManager: models.IBookmarkManager,
  ): void {
    this.vscodeManager.window.showInputBox({
      // eslint-disable-next-line max-len
      prompt: `Create a file "${configManager.defaultBookmarkFullPath()}" as setup. If you want to continue, enter "y|yes".`,
    })
    .then(input => {
      if (input === 'y' || input === 'yes') {
        try {
          // check folder.
          if (fs.existsSync(fileutils.resolveHome(configManager.defaultDir()))) {
            this.vscodeManager.window.showInformationMessage('OK! Confirmed the existence of the destination folder.');
          } else {
            fs.mkdirSync(fileutils.resolveHome(configManager.defaultDir()));
            // eslint-disable-next-line max-len
            this.vscodeManager.window.showInformationMessage(`OK! Create a new destination folder(${configManager.defaultDir()}).`);
          }

          // check file.
          if (fs.existsSync(fileutils.resolveHome(configManager.defaultBookmarkFullPath()))) {
            this.vscodeManager.window.showInformationMessage('OK! Confirmed the existence of the destination file.');
          } else {
            var blob = JSON.stringify(this.bookmarkManager.cerateBookmarksInfo());
            fs.writeFileSync(fileutils.resolveHome(configManager.defaultBookmarkFullPath()), blob);
            this.vscodeManager.window.showInformationMessage(
              `OK! Create a new destination folder(${configManager.defaultBookmarkFullPath()}).`,
            );
          }
          this.vscodeManager.window.showInformationMessage('Setup completed! ');
        } catch (e) {
          this.vscodeManager.window.showErrorMessage('An error occurred during setup.' + e.message);
        }
      } else {
        this.vscodeManager.window.showWarningMessage('Abort setup.');
      }
    })
  }
}
