import { BookmarkType } from './bookmark';

/**
 * Display label.
 */
export interface IBookmarkLabel {
  /**
   * identify
   */
  id: string;

  /**
   * label
   */
  label: string;

  /**
   * Indicates the type of bookmark.
   */
  type: BookmarkType;

  /**
   * label detail
   */
  description: string;
}
