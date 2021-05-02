/**
 * BookmarkType is used to indicate the type of bookmark.
 */
export type BookmarkType = 'file' | 'url' | 'folder';


/**
 * Bookmarks is model.
 */
export interface IBookmark {
  /**
   * Identify
   */
  id: string;

  /**
   * Indicates the type of bookmark.
   */
  type: BookmarkType;

  /**
   * Alias
   */
  alias: string | undefined;

  /**
   * This is the detailed information for Bookmarks. All information is stored here and deployed according to Type.
   */
  detail: string;
}
