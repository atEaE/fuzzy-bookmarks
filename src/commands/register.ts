import * as fs from 'fs';
import * as fileutils from '../utils/file';

// ok
import * as models from '../models';
import { CommandBase } from './base';
import { ExtensionCommandError } from './extensionCommandError';

/**
 * Register command.
 */
export class Register extends CommandBase {
  constructor(private vscodeManager: models.IVSCodeManager, bookmarkManager: models.IBookmarkManager) {
    super(bookmarkManager);
  }

  /**
   * Return the command name.
   * @returns command name.
   */
  public name(): string {
    return 'fzb.registerBookmarks';
  }

  /**
   * Execute.
   */
  public execute(
    execArgs: models.IVSCodeExecutableArguments,
    configManager: models.IConfigManager,
    _bookMarkManager: models.IBookmarkManager,
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

    var path = fileutils.resolveHome(configManager.defaultBookmarkFullPath());
    var option: models.IVSCodeInputBoxOptions = {};
    if (execArgs.uri) {
      option = { value: execArgs.uri.path, ignoreFocusOut: false };
    }
    this.vscodeManager.window.showInputBox(option).then(detail => {
      if (!detail) {
        return;
      }
      this.vscodeManager.window.showInputBox({ prompt: 'Enter arias. You can also skip this step.' }).then(alias => {
        var bk = this.identifyInput(detail, alias);
        if (!bk) {
          this.vscodeManager.window.showWarningMessage('Sorry.. Unable to identify your input. ');
          return;
        }

        switch (bk.type) {
          case 'file':
            bookmarksInfo?.fileBookmarks.push(bk);
            break;
          case 'folder':
            bookmarksInfo?.folderBookmarks.push(bk);
            break;
          case 'url':
            bookmarksInfo?.urlBookmarks.push(bk);
            break;
          default:
            this.vscodeManager.window.showWarningMessage('Sorry.. Unable to identify your input. ');
            return;
        }

        try {
          fs.writeFileSync(path, JSON.stringify(bookmarksInfo), { encoding: 'utf-8' });
          this.vscodeManager.window.showInformationMessage('Bookmarking is complete🔖');
        } catch (e) {
          this.vscodeManager.window.showErrorMessage(e.message);
        }
      });
    });
  }

  /**
   * Determines if the input is a URL-type Bookmark.
   * @param detail user input detail
   * @param alias user input alias
   * @returns maybe bookmark
   */
  private identifyURLInput(
    detail: string,
    alias: string | undefined,
  ): models.IBookmark | undefined {
    if (detail.startsWith('http://') || detail.startsWith('https://')) {
      return this.bookmarkManager.createBookmark('url', detail, alias);
    }
    return undefined;
  }

  /**
   * Determines if the input is a File-type or Folder-type Bookmark.
   * @param detail user input detail
   * @param alias user input alias
   * @returns maybe bookmark
   */
  private identifyFileInput(
    detail: string,
    alias: string | undefined,
  ): models.IBookmark | undefined {
    try {
      var path = fileutils.resolveHome(detail);
      if (fs.existsSync(path)) {
        var stat = fs.statSync(path);
        if (stat.isDirectory()) {
          return this.bookmarkManager.createBookmark('folder', detail, alias);
        } else {
          return this.bookmarkManager.createBookmark('file', detail, alias);
        }
      } else {
        return undefined;
      }
    } catch {
      return undefined;
    }
  }

  /**
   * It identifies the input and creates a Bookmark based on the content.
   * @param detail user input detail
   * @param alias user input alias
   * @returns bookmark
   */
  private identifyInput(detail: string, alias: string | undefined): models.IBookmark | undefined {
    var maybe = this.identifyURLInput(detail, alias);
    if (maybe) {
      return maybe;
    }

    maybe = this.identifyFileInput(detail, alias);
    if (maybe) {
      return maybe;
    }
    return undefined;
  }
}
