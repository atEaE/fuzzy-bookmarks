import * as jsonutils from '../utils/json';
import * as fileutils from '../utils/file';

// ok
import * as models from '../models';
import * as uuid from 'uuid';
import { BookmarkError } from './bookmarkError';

/**
 * Format version.
 */
const FORMAT_VERSION = '2.2.0';

export class BookmarkManager implements models.IBookmarkManager {
  /**
   * Create a bookmarksInfo
   * @returns bookmarksInfo
   */
  public cerateBookmarksInfo(): models.IBookmarksInfo {
    return {
      version: FORMAT_VERSION,
      fileBookmarks: [],
      folderBookmarks: [],
      urlBookmarks: [],
    };
  }

  /**
   * Create a bookmark
   * @param type type
   * @param detail bookmark detail
   * @param alias bookmark alias
   * @returns bookmark
   */
  public createBookmark(
    type: models.BookmarkType,
    detail: string,
    alias: string | undefined,
  ): models.IBookmark {
    return { id: uuid.v4(), type, alias, detail };
  }

  /**
   * Create the items needed to display the Pick.
   * @param bookmark bookmark
   * @return bookmarklabel
   */
  public createBookmarkLabel(
    bookmark: models.IBookmark,
  ): models.IBookmarkLabel {
    return {
      id: bookmark.id,
      label: this.getLabel(bookmark.type, bookmark.alias),
      type: bookmark.type,
      description: bookmark.detail,
    };
  }

  /**
   * Load Bookmark information.
   * @param fullPath bookmark.json fullpath.
   * @returns bookmarksinfo
   */
  public loadBookmarksInfo(fullPath: string): models.IBookmarksInfo {
    var blob = fileutils.safeReadFileSync(
      fileutils.resolveHome(fullPath),
      'utf-8',
    );
    if (!blob) {
      throw new BookmarkError(
        `Failed to load "${fullPath}". Please check the existence of the file.`,
      );
    }
    var bookmarksInfo = jsonutils.safeParse<models.IBookmarksInfo>(blob);
    if (!bookmarksInfo) {
      throw new BookmarkError(
        `Failed to load "${fullPath}". The format is different from what is expected.`,
      );
    }
    return bookmarksInfo;
  }

  /**
   * Concat BookmarkInfo.
   * @param base base BookmarksInfo
   * @param add add BookmarksInfo
   */
  public concatBookmarksInfo(
    base: models.IBookmarksInfo,
    ...add: models.IBookmarksInfo[]
  ): void {
    add.forEach(bi => {
      base.fileBookmarks = base.fileBookmarks.concat(bi.fileBookmarks);
      base.folderBookmarks = base.folderBookmarks.concat(bi.folderBookmarks);
      base.urlBookmarks = base.urlBookmarks.concat(bi.urlBookmarks);
    });
  }

  /**
   * Sorting and concat Bookmark.
   * @param bookmarksInfo BookmarksInfo
   * @returns afeter concat array
   */
  public sortAndConcatBookmark(
    bookmarksInfo: models.IBookmarksInfo,
  ): models.IBookmark[] {
    return bookmarksInfo.fileBookmarks
      .concat(bookmarksInfo.folderBookmarks)
      .concat(bookmarksInfo.urlBookmarks);
  }

  /**
   * Get the label according to the type.
   * @param type bookmark types
   * @param alias bookmark alias
   */
  private getLabel(
    type: models.BookmarkType,
    alias: string | undefined,
  ): string {
    var label: string = '';
    if (alias) {
      label = alias;
    }

    switch (type) {
      case 'file':
        return `$(file) ${label}`;
      case 'url':
        return `$(globe) ${label}`;
      case 'folder':
        return `$(folder) ${label}`;
      default:
        return `$(warning) ${label}`;
    }
  }
}
