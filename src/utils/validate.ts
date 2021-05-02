/**
 * It has the ability to verify the validity of an object.
 */
export interface IValidateObject {
    validate(): [boolean, IInValidReason]
}

/**
 * Stores the reason for invalidation.
 */
export interface IInValidReason {
    error: string
}
