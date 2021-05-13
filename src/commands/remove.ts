// TODO: want to replace it with a testable module.
import * as fs from 'fs';
import * as path from 'path';
import * as fileutils from '../utils/file';

// ok
import * as models from '../models';

const _empty = '';

/**
 * Remove command.
 */
export class Remove implements models.ICommand {
  constructor(private vscodeManager: models.IVSCodeManager, private bookmarkManager: models.IBookmarkManager) {}

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
  public async execute(_execArgs: models.IVSCodeExecutableArguments, configManager: models.IConfigManager) {
    // validate cofiguration.
    var [ok, reason] = configManager.validate();
    if (!ok) {
      this.vscodeManager.window.showWarningMessage(reason.error);
      return;
    }

    // select save type.
    var selectSaveType = await this.selectSaveType();
    if (!selectSaveType) {
      return;
    }
    var saveType = selectSaveType;

    // load file
    var bookmarksInfo: models.IBookmarksInfo;
    try {
      if (saveType === models.SAVETYPE_GLOBAL) {
        // global
        let fullPath = configManager.defaultBookmarkFullPath();
        bookmarksInfo = this.bookmarkManager.loadBookmarksInfo(fullPath ? fullPath : _empty);
      } else {
        // workspace
        let root = this.vscodeManager.currentRootFolder;
        if (root) {
          let wkBookmarksPath = path.join(root, '.vscode', configManager.defaultFileName());
          if (fs.existsSync(wkBookmarksPath)) {
            bookmarksInfo = this.bookmarkManager.loadBookmarksInfo(wkBookmarksPath);
          } else {
            this.vscodeManager.window.showWarningMessage(`There is no ".vscode/bookmarks.json" in workspace.`);
            return;
          }
        } else {
          this.vscodeManager.window.showWarningMessage(`Directory has not been opened.`);
          return;
        }
      }
    } catch (e) {
      this.vscodeManager.window.showWarningMessage(e.message);
      return;
    }

    var concatBk = this.bookmarkManager.sortAndConcatBookmark(bookmarksInfo);
    var items = concatBk.map<models.IBookmarkLabel>(b => this.bookmarkManager.createBookmarkLabel(b));
    if (items.length === 0) {
      this.vscodeManager.window.showWarningMessage('Bookmark has not been registered.');
      return;
    }

    var selectedRemovedBk = await this.vscodeManager.window.showQuickPick(items, {
      matchOnDescription: true,
      matchOnDetail: true,
      canPickMany: true,
    });
    if (!selectedRemovedBk || selectedRemovedBk.length === 0) {
      return;
    }

    var root = this.vscodeManager.currentRootFolder;
    var savePath = fileutils.resolveToAbsolute(root ? root : _empty, configManager.defaultBookmarkFullPath());
    this.mainProcess(bookmarksInfo, selectedRemovedBk, savePath);
  }

  private async selectSaveType(): Promise<models.SaveType | undefined> {
    var selectItem = [{ label: models.SAVETYPE_GLOBAL }, { label: models.SAVETYPE_WORKSPACE }];

    var selectedItem = await this.vscodeManager.window.showQuickPick(selectItem);
    return selectedItem?.label;
  }

  /**
   * remove main process
   * @param bookmarksInfo Bookmarksinfo
   * @param removeSelectedBk remove bookmarks
   * @param savePath save path.
   */
  private mainProcess(
    bookmarksInfo: models.IBookmarksInfo,
    removeSelectedBk: models.IBookmarkLabel[],
    savePath: string,
  ): void {
    removeSelectedBk.forEach(item => {
      if (bookmarksInfo) {
        switch (item.type) {
          case 'file':
            bookmarksInfo.fileBookmarks = bookmarksInfo.fileBookmarks.filter(b => b.id !== item.id);
            break;
          case 'folder':
            bookmarksInfo.folderBookmarks = bookmarksInfo.folderBookmarks.filter(b => b.id !== item.id);
            break;
          case 'url':
            bookmarksInfo.urlBookmarks = bookmarksInfo.urlBookmarks.filter(b => b.id !== item.id);
            break;
          default:
            break;
        }
      }
    });

    try {
      fs.writeFileSync(savePath, JSON.stringify(bookmarksInfo), {
        encoding: 'utf-8',
      });
      this.vscodeManager.window.showInformationMessage('Bookmark has been removed.');
    } catch (e) {
      this.vscodeManager.window.showErrorMessage(e.message);
      return;
    }
  }
}
