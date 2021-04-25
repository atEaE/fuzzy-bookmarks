/**
 * It has the ability to verify the validity of an object.
 */
export interface ValidateObject {
    validate(): [boolean, InValidReason]
}

/**
 * Stores the reason for invalidation.
 */
export interface InValidReason {
    error: string
}