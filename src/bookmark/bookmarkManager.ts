import * as models from '../models';
import * as uuid from 'uuid';

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
    return { version: FORMAT_VERSION, fileBookmarks: [], folderBookmarks: [], urlBookmarks: [] };
  }

  /**
   * Create a bookmark
   * @param type type
   * @param detail bookmark detail
   * @param alias bookmark alias
   * @returns bookmark
   */
  public createBookmark(type: models.BookmarkType, detail: string, alias: string | undefined): models.IBookmark {
    return { id: uuid.v4(), type, alias, detail };
  }

  /**
   * Create the items needed to display the Pick.
   * @param bookmark bookmark
   * @return bookmarklabel
   */
  public createBookmarkLabel(bookmark: models.IBookmark): models.IBookmarkLabel {
    return {
      id: bookmark.id,
      label: this.getLabel(bookmark.type, bookmark.alias),
      type: bookmark.type,
      description: bookmark.detail,
    };
  }

  /**
   * Get the label according to the type.
   * @param type bookmark type
   * @param alias bookmark alias
   */
  private getLabel(type: models.BookmarkType, alias: string | undefined): string {
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
