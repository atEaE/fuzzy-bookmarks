/**
 * It has the ability to verify the validity of an object.
 */
export interface ValidateObject<T> {
    validate(): [boolean, InValidReason<T>]
}

/**
 * Stores the reason for invalidation.
 */
export interface InValidReason<T> {
    code: T
    error: string
}