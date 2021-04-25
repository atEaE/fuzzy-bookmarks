
/**
 * BookmarkType is used to indicate the type of bookmark.
 */
type BookmarkType = "file" | "url" | "folder";

/**
 * Format version.
 */
export const FORMAT_VERSION = "1.0.0"

/**
 * BookmarksInfo is the metadata used for storage.
 */
export interface BookmarksInfo {
    /**
     * Format version.
     */
    version: string

    /**
     * Bookmarks.
     */
    bookmarks: Bookmark[]
}

/**
 * Bookmarks is model.
 */
export interface Bookmark {
    /**
     * Indicates the type of bookmark.
     */
    type: BookmarkType

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
 * Create the items needed to display the Pick.
 * @param bookmark bookmark
 * @return bookmarklabel
 */
export function createBookmarkLabel(bookmark: Bookmark): BookmarkLabel {
    return {
        label: getLabel(bookmark.type),
        type: bookmark.type,
        description: bookmark.detail,
    };
}

/**
 * Get the label according to the type.
 * @param type bookmark type
 */
function getLabel(type: BookmarkType): string {
    switch (type) {
        case 'file':
            return "$(file)";
        case 'url':
            return "$(globe)";
        case 'folder':
            return "$(folder)";
        default:
            return "$(warning)";
    }
}