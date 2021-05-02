import { IBookmark } from './bookmark';

/**
 * BookmarksInfo is the metadata used for storage.
 */
export interface IBookmarksInfo {
  /**
   * Format version.
   */
  version: string;

  /**
   * File bookmarks.
   */
  fileBookmarks: IBookmark[];

  /**
   * Folder bookmarks.
   */
  folderBookmarks: IBookmark[];

  /**
   * URL bookmarks.
   */
  urlBookmarks: IBookmark[];
}
