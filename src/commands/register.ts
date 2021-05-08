import * as fs from 'fs';
import { URL } from 'url';
import * as fileutils from '../utils/file';

// ok
import * as models from '../models';

const _empty = '';

/**
 * Register command.
 */
export class Register implements models.ICommand {
  constructor(
    private vscodeManager: models.IVSCodeManager,
    private bookmarkManager: models.IBookmarkManager,
  ) {}

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
      bookmarksInfo = this.bookmarkManager.loadBookmarksInfo(
        fullPath ? fullPath : _empty,
      );
    } catch (e) {
      this.vscodeManager.window.showWarningMessage(e.message);
      return;
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

      var tAlias = this.complementAlias(detail);
      this.vscodeManager.window
        .showInputBox({
          value: tAlias,
          prompt: 'Enter arias. You can also skip this step.',
        })
        .then(alias => {
          var bk = this.identifyInput(detail, alias);
          if (!bk) {
            this.vscodeManager.window.showWarningMessage(
              'Sorry.. Unable to identify your input. ',
            );
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
              this.vscodeManager.window.showWarningMessage(
                'Sorry.. Unable to identify your input. ',
              );
              return;
          }

          try {
            fs.writeFileSync(path, JSON.stringify(bookmarksInfo), {
              encoding: 'utf-8',
            });
            this.vscodeManager.window.showInformationMessage(
              'Bookmarking is complete🔖',
            );
          } catch (e) {
            this.vscodeManager.window.showErrorMessage(e.message);
          }
        });
    });
  }

  /**
   * Performs alias completion processing for URLs.
   * @param detail user input
   * @returns alias
   */
  private complementAliasForURL(detail: string): string | undefined {
    if (detail.startsWith('http://') || detail.startsWith('https://')) {
      return new URL(detail).hostname;
    }
    return undefined;
  }

  /**
   * Performs alias completion processing for File and Directory.
   * @param detail user input
   * @returns alias
   */
  private complementAliasForFile(detail: string): string | undefined {
    try {
      var file = this.vscodeManager.urlHelper.file(detail);
      return file.path.split('/').reverse()[0];
    } catch {
      return undefined;
    }
  }

  /**
   * Performs alias completion processing.
   * @param detail user input
   * @returns alias
   */
  private complementAlias(detail: string): string {
    var maybe = this.complementAliasForURL(detail);
    if (maybe) {
      return maybe;
    }

    maybe = this.complementAliasForFile(detail);
    if (maybe) {
      return maybe;
    }
    return _empty;
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
  private identifyInput(
    detail: string,
    alias: string | undefined,
  ): models.IBookmark | undefined {
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
