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

    // select save type.
    var selectSaveType = await this.selectSaveType();
    if (!selectSaveType) {
      return;
    }
    var saveType = selectSaveType;

    // if the command is called from explorer, get the URI.
    // If a file is selected from the exploiter and its saveType is `workspace`, convert it to a relative path.
    // HACK: https://github.com/atEaE/fuzzy-bookmarks/issues/59
    var detailOption: models.IVSCodeInputBoxOptions = {};
    if (execArgs.uri) {
      var defaultPath = execArgs.uri.path;
      if (saveType === models.SAVETYPE_WORKSPACE) {
        var root = this.vscodeManager.currentRootFolder;
        defaultPath = fileutils.resolveToRelative(root ? root : _empty, defaultPath);
      }
      detailOption = { value: defaultPath, ignoreFocusOut: false };
    }

    // get user input detail
    var detail = await this.getUserInputDetail(detailOption);
    if (detail === _empty) {
      return;
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
    return detail;
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
    saveType: models.SaveType,
    detail: string,
    alias: string,
  ) {
    // load bookmarks infomation
    var bookmarksPath: string;
    if (saveType === models.SAVETYPE_GLOBAL) {
      let tmp = configManager.defaultBookmarkFullPath();
      bookmarksPath = tmp ? tmp : _empty;
    } else {
      let root = this.vscodeManager.currentRootFolder;
      if (root) {
        try {
          let wkVSCodePath = path.join(root, '.vscode');
          bookmarksPath = path.join(wkVSCodePath, configManager.defaultFileName());
          if (!fs.existsSync(fileutils.resolveToAbsolute(root, wkVSCodePath))) {
            fs.mkdirSync(fileutils.resolveToAbsolute(root, wkVSCodePath));
          }
          if (!fs.existsSync(fileutils.resolveToAbsolute(root, bookmarksPath))) {
            var blob = JSON.stringify(this.bookmarkManager.cerateBookmarksInfo());
            fs.writeFileSync(fileutils.resolveToAbsolute(root, bookmarksPath), blob);
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
      bookmarksInfo = this.bookmarkManager.loadBookmarksInfo(bookmarksPath);
    } catch (e) {
      this.vscodeManager.window.showWarningMessage(e.message);
      return;
    }

    // identify
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

    // save
    try {
      fs.writeFileSync(bookmarksPath, JSON.stringify(bookmarksInfo), {
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
   * @param detail user input detail
   * @param alias user input alias
   * @returns maybe bookmark
   */
  private identifyFileInput(detail: string, alias: string | undefined): models.IBookmark | undefined {
    try {
      let root = this.vscodeManager.currentRootFolder;
      var addPath = fileutils.resolveToAbsolute(root ? root : _empty, detail);
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
