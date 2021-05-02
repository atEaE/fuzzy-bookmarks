import { IVSCodeCancellationToken } from './vscodeCancellationToken';
import { IVSCodeInputBoxOptions } from './vscodeInputBoxOptions';
import { IVSCodeQuickPickItem } from './vscodeQuickPickItem';
import { IVSCodeQuickPickOptions } from './vscodeQuickPickOptions';

export interface IVSCodeWindow {
  showInformationMessage(message: string, ...items: string[]): Thenable<string | undefined>;
  showWarningMessage(message: string, ...items: string[]): Thenable<string | undefined>;
  showErrorMessage(message: string, ...items: string[]): Thenable<string | undefined>;
  showQuickPick<T extends IVSCodeQuickPickItem>(
    items: T[] | Thenable<T[]>,
    options: IVSCodeQuickPickOptions & { canPickMany: true },
    token?: IVSCodeCancellationToken,
  ): Thenable<string | undefined>;
  showQuickPick<T extends IVSCodeQuickPickItem>(
    items: T[] | Thenable<T[]>,
    options?: IVSCodeQuickPickOptions,
    token?: IVSCodeCancellationToken,
  ): Thenable<T | undefined>;
  showInputBox(options?: IVSCodeInputBoxOptions, token?: IVSCodeCancellationToken): Thenable<string | undefined>;
}

