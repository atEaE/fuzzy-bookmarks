import * as fs from 'fs';
import * as fileutils from '../utils/file';

// ok
import * as models from '../models';
import { CommandBase } from './base';
import { ExtensionCommandError } from './extensionCommandError';

/**
 * Export command.
 */
export class Show extends CommandBase {
  constructor(private vscodeManager: models.IVSCodeManager, bookmarkManager: models.IBookmarkManager) {
    super(bookmarkManager);
  }

  /**
   * Return the command name.
   * @returns command name.
   */
  public name(): string {
    return 'fzb.showBookmarks';
  }

  /**
   * Execute.
   */
   public execute(
    _execArgs: models.IVSCodeExecutableArguments,
    configManager: models.IConfigManager,
    bookMarkManager: models.IBookmarkManager
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

    var concatBk = this.concatBookmark(
      bookmarksInfo.fileBookmarks,
      bookmarksInfo.folderBookmarks,
      bookmarksInfo.urlBookmarks,
    );
    var items = concatBk.map<models.IBookmarkLabel>(b => this.bookmarkManager.createBookmarkLabel(b));
    if (items.length === 0) {
      this.vscodeManager.window.showWarningMessage('Bookmark has not been registered.');
      return;
    }
    this.vscodeManager.window.showQuickPick(items, { matchOnDescription: true, matchOnDetail: true }).then(item => {
      if (!item) {
        return;
      }
      this.vscodeManager.window.showInformationMessage(item.description);
      switch(item.type) {
        case 'file':
          this.showFile(item.description);
          break;
        case 'folder':
          break;
        case 'url':
          break;
        default:
          break;
      }
    });
  }

  private showFile(description: string | undefined) {
    if (description) {
      var path = fileutils.resolveHome(description);
      this.vscodeManager.window.showTextDocument(this.vscodeManager.urlHelper.file(path));
    }
  }
}

/**
 * Refer to the files registered in Bookmark.
 * @param config Fuzzy Bookmark configuration.
 * @param description bookmark description.

function
*/

/**
 * Refer to the folder registered in Bookmark.
 * @param config Fuzzy Bookmark configuration.
 * @param description bookmark description.

function showFolder(config: IFzbConfig, description: string | undefined) {
  if (description) {
    var path = fileutils.resolveHome(description);
    switch (config.directoryOpenType()) {
      case 'terminal':
        // eslint-disable-next-line max-len
        // refs: https://github.com/microsoft/vscode/blob/94c9ea46838a9a619aeafb7e8afd1170c967bb55/src/vs/workbench
        /contrib/externalTerminal/browser/externalTerminal.contribution.ts#L30-L83
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
 */

/**
 * Refer to the URL registered in Bookmark.
 * @param config Fuzzy Bookmark configuration.
 * @param description bookmark description.

function showUrl(_: IFzbConfig, description: string | undefined) {
  if (description) {
    open(description);
  }
}
 */

/**
 * Execute the process of show command.
 * @param config Fuzzy Bookmark configuration.
 * @returns void

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
}
*/
