
/**
 * BookmarkType is used to indicate the type of bookmark.
 */
type BookmarkType = "file"

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