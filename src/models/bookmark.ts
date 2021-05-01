import * as uuid from 'uuid';

/**
 * BookmarkType is used to indicate the type of bookmark.
 */
type BookmarkType = "file" | "url" | "folder";

/**
 * Format version.
 */
export const FORMAT_VERSION = "2.1.0";

/**
 * BookmarksInfo is the metadata used for storage.
 */
export interface BookmarksInfo {
    /**
     * Format version.
     */
    version: string

    /**
     * File bookmarks.
     */
    fileBookmarks: Bookmark[]

    /**
     * Folder bookmarks.
     */
    folderBookmarks: Bookmark[]

    /**
     * URL bookmarks.
     */
    urlBookmarks: Bookmark[]
}

/**
 * Bookmarks is model.
 */
export interface Bookmark {
    /**
     * Identify
     */
    id: string

    /**
     * Indicates the type of bookmark.
     */
    type: BookmarkType

    /**
     * Alias
     */
    alias: string | undefined

    /**
     * This is the detailed information for Bookmarks. All information is stored here and deployed according to Type.
     */
    detail: string
}

/**
 * Display label.
 */
export interface BookmarkLabel {
    /**
     * identify
     */
    id: string

    /**
     * label
     */
    label: string

    /**
     * Indicates the type of bookmark.
     */
    type: BookmarkType

    /**
     * label detail
     */
    description: string
}

/**
 * Create a bookmarksInfo
 * @returns bookmarksInfo
 */
export function cerateBookmarksInfo(): BookmarksInfo {
    return { version: FORMAT_VERSION, fileBookmarks: [], folderBookmarks: [], urlBookmarks: [] };
}

/**
 * Create a bookmark
 * @param type type
 * @param detail bookmark detail
 * @param alias bookmark alias
 * @returns bookmark
 */
export function createBookmark(type: BookmarkType, detail: string, alias: string | undefined): Bookmark {
    return { id: uuid.v4(), type: type, alias: alias, detail: detail };
}

/**
 * Create the items needed to display the Pick.
 * @param bookmark bookmark
 * @return bookmarklabel
 */
export function createBookmarkLabel(bookmark: Bookmark): BookmarkLabel {
    return {
        id: bookmark.id,
        label: getLabel(bookmark.type, bookmark.alias),
        type: bookmark.type,
        description: bookmark.detail,
    };
}

/**
 * Get the label according to the type.
 * @param type bookmark type
 * @param alias bookmark alias
 */
function getLabel(type: BookmarkType, alias: string | undefined): string {
    var label: string = ""
    if (alias) {
        label = alias
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