export interface IVSCodeQuickPickItem {
  /**
   * A human-readable string which is rendered prominent. Supports rendering of [theme icons](#ThemeIcon) via
   * the `$(<name>)`-syntax.
   */
  label: string;

  /**
   * A human-readable string which is rendered less prominent in the same line. Supports rendering of
   * [theme icons](#ThemeIcon) via the `$(<name>)`-syntax.
   */
  description?: string;

  /**
   * A human-readable string which is rendered less prominent in a separate line. Supports rendering of
   * [theme icons](#ThemeIcon) via the `$(<name>)`-syntax.
   */
  detail?: string;

  /**
   * Optional flag indicating if this item is picked initially.
   * (Only honored when the picker allows multiple selections.)
   */
  picked?: boolean;

  /**
   * Always show this item.
   */
  alwaysShow?: boolean;
}
