import { IBookmarksInfo } from './bookmarksInfo';
import { IBookmarkLabel } from './bookmarkLabel';
import { IBookmark, BookmarkType } from './bookmark';

export interface IBookmarkManager {
  cerateBookmarksInfo(): IBookmarksInfo;
  createBookmark(
    type: BookmarkType,
    detail: string,
    alias: string | undefined,
  ): IBookmark;
  createBookmarkLabel(prefix: string, workspace: string, bookmark: IBookmark): IBookmarkLabel;
  loadBookmarksInfo(fullPath: string): IBookmarksInfo;
  concatBookmarksInfo(base: IBookmarksInfo, ...add: IBookmarksInfo[]): void;
  sortAndConcatBookmark(bookmarksInfo: IBookmarksInfo): IBookmark[];
}
