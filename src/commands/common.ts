import * as extsutils from '../utils/extensions';
import * as jsonutils from '../utils/json';
import * as fileutils from '../utils/file';
import { IFzbConfig } from '../contributes';
import { IBookmark, IBookmarksInfo } from '../models/bookmark';

/**
 * Load Bookmark information.
 * @param config Fuzzy Bookmarks configuration
 * @returns bookmarksinfo
 */
export function loadBookmarksInfo(config: IFzbConfig): IBookmarksInfo {
  var blob = fileutils.safeReadFileSync(fileutils.resolveHome(config.defaultBookmarkFullPath()), 'utf-8');
  if (!blob) {
    throw new extsutils.FzbExtensionsError(
      `Failed to load "${config.defaultBookmarkFullPath()}". Please check the existence of the file.`,
    );
  }
  var bookmarksInfo = jsonutils.safeParse<IBookmarksInfo>(blob);
  if (!bookmarksInfo) {
    throw new extsutils.FzbExtensionsError(
      `Failed to load "${config.defaultBookmarkFullPath()}". The format is different from what is expected.`,
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
export function concatBookmark(fileBk: IBookmark[], folderBk: IBookmark[], urlBk: IBookmark[]): IBookmark[] {
  return fileBk.concat(folderBk).concat(urlBk);
}
