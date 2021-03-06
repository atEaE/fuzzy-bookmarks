import * as fs from 'fs';
import * as fileutils from '../utils/file';

// ok
import * as models from '../models';

/**
 * Remove command.
 */
export class Remove implements models.ICommand {
  constructor(
    private vscodeManager: models.IVSCodeManager,
    private bookmarkManager: models.IBookmarkManager,
  ) {}

  /**
   * Return the command name.
   * @returns command name.
   */
  public name(): string {
    return 'fzb.removeBookmarks';
  }

  /**
   * Execute.
   */
  public execute(
    _execArgs: models.IVSCodeExecutableArguments,
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
        fullPath ? fullPath : '',
      );
    } catch (e) {
      this.vscodeManager.window.showWarningMessage(e.message);
      return;
    }

    var concatBk = this.bookmarkManager.sortAndConcatBookmark(bookmarksInfo);
    var items = concatBk.map<models.IBookmarkLabel>(b =>
      this.bookmarkManager.createBookmarkLabel(b),
    );
    if (items.length === 0) {
      this.vscodeManager.window.showWarningMessage(
        'Bookmark has not been registered.',
      );
      return;
    }

    var path = fileutils.resolveHome(configManager.defaultBookmarkFullPath());
    this.vscodeManager.window
      .showQuickPick(items, {
        matchOnDescription: true,
        matchOnDetail: true,
        canPickMany: true,
      })
      .then(selected => {
        if (!selected || selected.length === 0) {
          return;
        }

        selected.forEach(item => {
          if (bookmarksInfo) {
            switch (item.type) {
              case 'file':
                bookmarksInfo.fileBookmarks = bookmarksInfo.fileBookmarks.filter(
                  b => b.id !== item.id,
                );
                break;
              case 'folder':
                bookmarksInfo.folderBookmarks = bookmarksInfo.folderBookmarks.filter(
                  b => b.id !== item.id,
                );
                break;
              case 'url':
                bookmarksInfo.urlBookmarks = bookmarksInfo.urlBookmarks.filter(
                  b => b.id !== item.id,
                );
                break;
              default:
                break;
            }
          }
        });

        try {
          fs.writeFileSync(path, JSON.stringify(bookmarksInfo), {
            encoding: 'utf-8',
          });
          this.vscodeManager.window.showInformationMessage(
            'Bookmark has been removed.',
          );
        } catch (e) {
          this.vscodeManager.window.showErrorMessage(e.message);
          return;
        }
      });
  }
}
