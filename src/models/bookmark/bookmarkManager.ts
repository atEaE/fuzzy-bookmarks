import { IBookmarksInfo } from './bookmarksInfo';
import { IBookmarkLabel } from './bookmarkLabel';
import { IBookmark, BookmarkType } from './bookmark';

export interface IBookmarkManager {
  cerateBookmarksInfo(): IBookmarksInfo;
  createBookmark(type: BookmarkType, detail: string, alias: string | undefined): IBookmark
  createBookmarkLabel(bookmark: IBookmark): IBookmarkLabel
}
