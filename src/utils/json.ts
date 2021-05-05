
/**
 * Converts a JavaScript Object Notation (JSON) string into an object.
 * If the type conversion fails, it does not throw an Error.
 * @param text A valid JSON string.
 * @param reviver A function that transforms the results. This function is called for each member of the object.
 * If a member contains nested objects, the nested objects are transformed before the parent object is.
 * @returns blob
 */
export function safeParse<T>(text: string, reviver?: (this: any, key: string, value: any) => any): T | undefined {
    try {
        return JSON.parse(text, reviver) as T;
    } catch {
        return undefined;
    }
}
