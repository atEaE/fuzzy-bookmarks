import { IVSCodeQuickPickItem } from './vscodeQuickPickItem';

export interface IVSCodeQuickPickOptions {
  matchOnDescription?: boolean;
  matchOnDetail?: boolean;
  placeHolder?: string;
  ignoreFocusOut?: boolean;
  canPickMany?: boolean;
  onDidSelectItem?(item: IVSCodeQuickPickItem | string): any;
}
