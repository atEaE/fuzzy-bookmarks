export interface IVSCodeInputBoxOptions {

  /**
   * The value to prefill in the input box.
   */
  value?: string;

  /**
   * Selection of the prefilled [`value`](#InputBoxOptions.value). Defined as tuple of two number where the
   * first is the inclusive start index and the second the exclusive end index. When `undefined` the whole
   * word will be selected, when empty (start equals end) only the cursor will be set,
   * otherwise the defined range will be selected.
   */
  valueSelection?: [number, number];

  /**
   * The text to display underneath the input box.
   */
  prompt?: string;

  /**
   * An optional string to show as placeholder in the input box to guide the user what to type.
   */
  placeHolder?: string;

  /**
   * Controls if a password input is shown. Password input hides the typed text.
   */
  password?: boolean;

  /**
   * Set to `true` to keep the input box open when focus moves to another part of the editor or to another window.
   */
  ignoreFocusOut?: boolean;

  /**
   * An optional function that will be called to validate input and to give a hint
   * to the user.
   *
   * @param value The current value of the input box.
   * @return A human-readable string which is presented as diagnostic message.
   * Return `undefined`, `null`, or the empty string when 'value' is valid.
   */
  validateInput?(value: string): string | undefined | null | Thenable<string | undefined | null>;
}

