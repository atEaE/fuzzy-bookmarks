import * as open from 'open';
import * as fileutils from '../utils/file';

// ok
import * as models from '../models';

/**
 * Export command.
 */
export class Show implements models.ICommand {
  constructor(
    private vscodeManager: models.IVSCodeManager,
    private bookmarkManager: models.IBookmarkManager,
  ) {}

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
      // global
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
    this.vscodeManager.window
      .showQuickPick(items, { matchOnDescription: true, matchOnDetail: true })
      .then(item => {
        if (!item) {
          return;
        }
        switch (item.type) {
          case 'file':
            this.showFile(item.description);
            break;
          case 'folder':
            this.showFolder(configManager, item.description);
            break;
          case 'url':
            this.showUrl(item.description);
            break;
          default:
            break;
        }
      });
  }

  /**
   * Refer to the files registered in Bookmark.
   * @param description bookmark description.
   */
  private showFile(description: string | undefined) {
    if (description) {
      var path = fileutils.resolveHome(description);
      this.vscodeManager.window.showTextDocument(
        this.vscodeManager.urlHelper.file(path),
        {
          preview: false,
        },
      );
    }
  }

  /**
   * Refer to the folder registered in Bookmark.
   * @param configManager Fuzzy Bookmark configuration manager.
   * @param description bookmark description.
   */
  private showFolder(
    configManager: models.IConfigManager,
    description: string | undefined,
  ) {
    if (description) {
      var path = fileutils.resolveHome(description);
      switch (configManager.directoryOpenType()) {
        case 'terminal':
          // eslint-disable-next-line max-len
          // refs: https://github.com/microsoft/vscode/blob/94c9ea46838a9a619aeafb7e8afd1170c967bb55/src/vs/workbench/contrib/externalTerminal/browser/externalTerminal.contribution.ts#L30-L83
          this.vscodeManager.commands.executeCommand(
            'openInTerminal',
            this.vscodeManager.urlHelper.file(path),
          );
          break;
        case 'explorer':
          open(path);
          break;
        case 'window':
          this.vscodeManager.commands.executeCommand(
            'vscode.openFolder',
            this.vscodeManager.urlHelper.file(path),
          );
          break;
        default:
          break;
      }
    }
  }

  /**
   * Refer to the URL registered in Bookmark.
   * @param description bookmark description.
   */
  private showUrl(description: string | undefined) {
    if (description) {
      open(description);
    }
  }
}
