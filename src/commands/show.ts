// TODO: want to replace it with a testable module.
import * as open from 'open';
import * as path from 'path';
import * as fs from 'fs';
import * as fileutils from '../utils/file';

// ok
import * as models from '../models';

const _empty = '';

/**
 * Show command.
 */
export class Show implements models.ICommand {
  constructor(private vscodeManager: models.IVSCodeManager, private bookmarkManager: models.IBookmarkManager) {}

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
  public async execute(_execArgs: models.IVSCodeExecutableArguments, configManager: models.IConfigManager) {
    // validate cofiguration.
    var [ok, reason] = configManager.validate();
    if (!ok) {
      this.vscodeManager.window.showWarningMessage(reason.error);
      return;
    }

    // load file
    var bookmarksInfos: Array<{ domain: string; workspace: string; bookmarks: models.IBookmarksInfo }> = [];
    try {
      // global
      let fullPath = configManager.defaultBookmarkFullPath();
      bookmarksInfos.push({
        domain: _empty,
        workspace: _empty,
        bookmarks: this.bookmarkManager.loadBookmarksInfo(fullPath ? fullPath : _empty),
      });

      // workspace
      let rootFolders = this.vscodeManager.workspace.workspaceFolders;
      if (rootFolders) {
        rootFolders.forEach(root => {
          let wkBookmarksPath = path.join(root.uri.path, '.vscode', configManager.defaultFileName());
          if (fs.existsSync(wkBookmarksPath)) {
            let wkBookmarksInfo = this.bookmarkManager.loadBookmarksInfo(wkBookmarksPath);
            bookmarksInfos.push({
              domain: root.name,
              workspace: root.uri.path,
              bookmarks: wkBookmarksInfo,
            });
          }
        });
      }
    } catch (e) {
      this.vscodeManager.window.showWarningMessage(e.message);
      return;
    }

    var concatLabel: models.IBookmarkLabel[] = [];
    bookmarksInfos.forEach(info => {
      var bkLabel = this.bookmarkManager
        .sortAndConcatBookmark(info.bookmarks)
        .map(b => this.bookmarkManager.createBookmarkLabel(info.domain, info.workspace, b));
      concatLabel.push(...bkLabel);
    });

    if (concatLabel.length === 0) {
      this.vscodeManager.window.showWarningMessage('Bookmark has not been registered.');
      return;
    }

    var item = await this.vscodeManager.window.showQuickPick(concatLabel, {
      matchOnDescription: true,
      matchOnDetail: true,
    });
    if (!item) {
      return;
    }

    this.mainProcess((configManager = configManager), (item = item));
  }

  /**
   * show main process.
   * @param configManager configuration manager
   * @param item selected bookmarkslabel
   */
  private mainProcess(configManager: models.IConfigManager, item: models.IBookmarkLabel): void {
    switch (item.type) {
      case 'file':
        this.showFile(item.workspace, item.originalDescription);
        break;
      case 'folder':
        this.showFolder(configManager, item.workspace, item.originalDescription);
        break;
      case 'url':
        this.showUrl(item.originalDescription);
        break;
      default:
        break;
    }
  }

  /**
   * Refer to the files registered in Bookmark.
   * @param workspace target workspace.
   * @param description bookmark description.
   */
  private showFile(workspace: string, description: string | undefined) {
    if (description) {
      var openPath = '';
      if (workspace) {
        openPath = fileutils.resolveToAbsolute(workspace, description);
      } else {
        openPath = fileutils.resolveHome(description);
      }
      this.vscodeManager.window.showTextDocument(this.vscodeManager.urlHelper.file(openPath), {
        preview: false,
      });
    }
  }

  /**
   * Refer to the folder registered in Bookmark.
   * @param configManager Fuzzy Bookmark configuration manager.
   * @param workspace target workspace.
   * @param description bookmark description.
   */
  private showFolder(configManager: models.IConfigManager, workspace: string, description: string | undefined) {
    if (description) {
      var openPath = '';
      if (workspace) {
        openPath = fileutils.resolveToAbsolute(workspace, description);
      } else {
        openPath = fileutils.resolveHome(description);
      }
      switch (configManager.directoryOpenType()) {
        case 'terminal':
          // eslint-disable-next-line max-len
          // refs: https://github.com/microsoft/vscode/blob/94c9ea46838a9a619aeafb7e8afd1170c967bb55/src/vs/workbench/contrib/externalTerminal/browser/externalTerminal.contribution.ts#L30-L83
          this.vscodeManager.commands.executeCommand('openInTerminal', this.vscodeManager.urlHelper.file(openPath));
          break;
        case 'explorer':
          open(openPath);
          break;
        case 'window':
          this.vscodeManager.commands.executeCommand('vscode.openFolder', this.vscodeManager.urlHelper.file(openPath));
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
