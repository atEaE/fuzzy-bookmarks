// TODO: want to replace it with a testable module.
import * as fs from 'fs';
import * as path from 'path';
import * as fileutils from '../utils/file';

// ok
import * as models from '../models';
import { URL } from 'url';

const _empty = '';

/**
 * Add command.
 */
export class Add implements models.ICommand {
  constructor(private vscodeManager: models.IVSCodeManager, private bookmarkManager: models.IBookmarkManager) {}

  /**
   * Return the command name.
   * @returns command name.
   */
  public name(): string {
    return 'fzb.addBookmarks';
  }

  /**
   * Execute.
   */
  public async execute(execArgs: models.IVSCodeExecutableArguments, configManager: models.IConfigManager) {
    // validate cofiguration.
    var [ok, reason] = configManager.validate();
    if (!ok) {
      this.vscodeManager.window.showWarningMessage(reason.error);
      return;
    }

    var wkFolders = this.vscodeManager.workspace.workspaceFolders;
    var saveType = { type: models.SAVETYPE_GLOBAL, path: _empty };
    if (wkFolders) {
      // Select saveTyue if you have workspace open.
      var selectSaveType = await this.selectSaveType();
      if (!selectSaveType) {
        return;
      }
      saveType.type = selectSaveType;

      // Select folder, if workspace is muliti workspace style.
      if (wkFolders.length > 1) {
        if (execArgs.uri) {
          var selectFilePath = execArgs.uri.path;
          var targetFolder = this.vscodeManager.workspace.workspaceFolders?.find(f =>
            selectFilePath.startsWith(f.uri.path),
          );
          if (!targetFolder) {
            // eslint-disable-next-line max-len
            this.vscodeManager.window.showErrorMessage(
              `Internal Error: workspace containing the selected file cannot be found.(${execArgs.uri.path})`,
            );
            return;
          }
          saveType.path = targetFolder?.uri.path;
        } else {
          var roots = wkFolders.map(f => {
            return { label: f.name, path: f.uri.path };
          });
          var root = await this.vscodeManager.window.showQuickPick(roots);
          if (!root) {
            return;
          }
          saveType.path = root.path;
        }
      } else {
        saveType.path = this.vscodeManager.currentRootFolder ? this.vscodeManager.currentRootFolder : _empty;
      }
    }

    // if the command is called from explorer, get the URI.
    // If a file is selected from the exploiter and its saveType is `workspace`, convert it to a relative path.
    // HACK: https://github.com/atEaE/fuzzy-bookmarks/issues/59
    var detail = _empty;
    if (execArgs.uri) {
      var fileDefaultPath = execArgs.uri.path;
      if (saveType.type === models.SAVETYPE_WORKSPACE) {
        detail = fileutils.resolveToRelative(saveType.path, fileDefaultPath);
      } else {
        detail = execArgs.uri.path;
      }
    } else {
      // get user input detail
      detail = await this.getUserInputDetail({});
      if (!detail) {
        return;
      }
    }

    // get userr input alias
    var alias = this.complementAlias(detail);
    var aliasOption = { value: alias, prompt: 'Enter arias. You can also skip this step.' };
    alias = await this.getUserInputAlias(aliasOption);

    this.mainProcess(
      (configManager = configManager),
      (saveType = saveType),
      (detail = detail ? detail : _empty),
      (alias = alias ? alias : _empty),
    );
  }

  private async selectSaveType(): Promise<models.SaveType | undefined> {
    var selectItem = [{ label: models.SAVETYPE_GLOBAL }, { label: models.SAVETYPE_WORKSPACE }];

    var selectedItem = await this.vscodeManager.window.showQuickPick(selectItem);
    return selectedItem?.label;
  }

  private async getUserInputDetail(option: models.IVSCodeInputBoxOptions): Promise<string> {
    var detail = await this.vscodeManager.window.showInputBox(option);
    if (!detail) {
      return _empty;
    }
    return detail.trim();
  }

  private async getUserInputAlias(option: models.IVSCodeInputBoxOptions): Promise<string> {
    var alias = await this.vscodeManager.window.showInputBox(option);
    if (!alias) {
      return _empty;
    }
    return alias;
  }

  /**
   * add main process
   * @param configManager configuration manager
   * @param saveType save type
   * @param detail bookmark detail
   * @param alias bookmark alias
   */
  private mainProcess(
    configManager: models.IConfigManager,
    saveType: { type: models.SaveType; path: string },
    detail: string,
    alias: string,
  ) {
    // load bookmarks infomation
    var absoluteBookmarksSavePath: string;
    if (saveType.type === models.SAVETYPE_GLOBAL) {
      absoluteBookmarksSavePath = fileutils.resolveHome(configManager.defaultBookmarkFullPath());
    } else {
      let root = this.vscodeManager.currentRootFolder;
      if (root) {
        try {
          // initialize <workspace>/.vscode/bookmarks.json
          var workspaceVSCodePath = path.join(saveType.path, '.vscode');
          absoluteBookmarksSavePath = path.join(workspaceVSCodePath, configManager.defaultFileName());
          if (!fs.existsSync(fileutils.resolveHome(workspaceVSCodePath))) {
            fs.mkdirSync(fileutils.resolveHome(workspaceVSCodePath));
          }
          if (!fs.existsSync(fileutils.resolveHome(absoluteBookmarksSavePath))) {
            var blob = JSON.stringify(this.bookmarkManager.cerateBookmarksInfo());
            fs.writeFileSync(fileutils.resolveHome(absoluteBookmarksSavePath), blob);
          }
        } catch (e) {
          this.vscodeManager.window.showErrorMessage(e.message);
          return;
        }
      } else {
        this.vscodeManager.window.showWarningMessage(`Directory has not been opened.`);
        return;
      }
    }
    var bookmarksInfo: models.IBookmarksInfo;
    try {
      bookmarksInfo = this.bookmarkManager.loadBookmarksInfo(absoluteBookmarksSavePath);
    } catch (e) {
      this.vscodeManager.window.showWarningMessage(e.message);
      return;
    }

    // identify
    var bk = this.identifyInput(saveType.path, detail, alias);
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

    // save
    try {
      fs.writeFileSync(absoluteBookmarksSavePath, JSON.stringify(bookmarksInfo), {
        encoding: 'utf-8',
      });
      this.vscodeManager.window.showInformationMessage('Bookmarking is complete🔖');
    } catch (e) {
      this.vscodeManager.window.showErrorMessage(e.message);
    }
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
  private identifyURLInput(detail: string, alias: string | undefined): models.IBookmark | undefined {
    if (detail.startsWith('http://') || detail.startsWith('https://')) {
      return this.bookmarkManager.createBookmark('url', detail, alias);
    }
    return undefined;
  }

  /**
   * Determines if the input is a File-type or Folder-type Bookmark.
   * @param basedir select workspace
   * @param detail user input detail
   * @param alias user input alias
   * @returns maybe bookmark
   */
  private identifyFileInput(basedir: string, detail: string, alias: string | undefined): models.IBookmark | undefined {
    try {
      var addPath = fileutils.resolveToAbsolute(basedir, detail);
      if (fs.existsSync(addPath)) {
        var stat = fs.statSync(addPath);
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
   * @param basedir select workspace
   * @param detail user input detail
   * @param alias user input alias
   * @returns bookmark
   */
  private identifyInput(basedir: string, detail: string, alias: string | undefined): models.IBookmark | undefined {
    var maybe = this.identifyURLInput(detail, alias);
    if (maybe) {
      return maybe;
    }

    maybe = this.identifyFileInput(basedir, detail, alias);
    if (maybe) {
      return maybe;
    }
    return undefined;
  }
}
