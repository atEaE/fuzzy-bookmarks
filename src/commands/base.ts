import * as jsonutils from '../utils/json';
import * as fileutils from '../utils/file';

// ok
import * as models from '../models';
import { ExtensionCommandError } from './extensionCommandError';

/**
 * Command base abstract class
 */
export abstract class CommandBase implements models.ICommand {
  protected bookmarkManager: models.IBookmarkManager;
  constructor(bookmarkManager: models.IBookmarkManager) {
    this.bookmarkManager = bookmarkManager;
  }

  /**
   * Load Bookmark information.
   * @param fullPath bookmark.json fullpath.
   * @returns bookmarksinfo
   */
  protected loadBookmarksInfo(fullPath: string): models.IBookmarksInfo {
    var blob = fileutils.safeReadFileSync(fileutils.resolveHome(fullPath), 'utf-8');
    if (!blob) {
      throw new ExtensionCommandError(
        `Failed to load "${fullPath}". Please check the existence of the file.`,
      );
    }
    var bookmarksInfo = jsonutils.safeParse<models.IBookmarksInfo>(blob);
    if (!bookmarksInfo) {
      throw new ExtensionCommandError(
        `Failed to load "${fullPath}". The format is different from what is expected.`,
      );
    }
    return bookmarksInfo;
  }

  /**
   * bookmarks array concat.
   * @param fileBk file bookmarks
   * @param folderBk folder bookmarks
   * @param urlBk url bookmarks
   * @returns afeter concat array
   */
  protected concatBookmark(
    fileBk: models.IBookmark[],
    folderBk: models.IBookmark[],
    urlBk: models.IBookmark[],
  ): models.IBookmark[] {
    return fileBk.concat(folderBk).concat(urlBk);
  }

  abstract name(): string;
  abstract execute(
    execArgs: models.IVSCodeExecutableArguments,
    configManager: models.IConfigManager,
    bookmarkManager: models.IBookmarkManager
  ): void;
}
