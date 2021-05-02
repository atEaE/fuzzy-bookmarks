import { IVSCodeQuickPickItem } from './vscodeQuickPickItem';

export interface IVSCodeQuickPickOptions {
  /**
   * An optional flag to include the description when filtering the picks.
   */
  matchOnDescription?: boolean;

  /**
   * An optional flag to include the detail when filtering the picks.
   */
  matchOnDetail?: boolean;

  /**
   * An optional string to show as placeholder in the input box to guide the user what to pick on.
   */
  placeHolder?: string;

  /**
   * Set to `true` to keep the picker open when focus moves to another part of the editor or to another window.
   */
  ignoreFocusOut?: boolean;

  /**
   * An optional flag to make the picker accept multiple selections, if true the result is an array of picks.
   */
  canPickMany?: boolean;

  /**
   * An optional function that is invoked whenever an item is selected.
   */
  onDidSelectItem?(item: IVSCodeQuickPickItem | string): any;
}
