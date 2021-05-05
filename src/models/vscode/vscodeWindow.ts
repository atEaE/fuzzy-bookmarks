import { IVSCodeCancellationToken } from './vscodeCancellationToken';
import { IVSCodeInputBoxOptions } from './vscodeInputBoxOptions';
import { IVSCodeTextDocumentShowOptions } from './vscodeTextDocumentShowOptions';
import { IVSCodeQuickPickItem } from './vscodeQuickPickItem';
import { IVSCodeUri } from './vscodeUri';
import { IVSCodeTextEditor } from './vscodeTextEtidor';
import { IVSCodeQuickPickOptions } from './vscodeQuickPickOptions';
import { IVSCodeTextDocument } from './vscodeTextDocument';

export interface IVSCodeWindow {
  showInformationMessage(message: string, ...items: string[]): Thenable<string | undefined>;
  showWarningMessage(message: string, ...items: string[]): Thenable<string | undefined>;
  showErrorMessage(message: string, ...items: string[]): Thenable<string | undefined>;
  showQuickPick<T extends IVSCodeQuickPickItem>(
    items: T[] | Thenable<T[]>,
    options: IVSCodeQuickPickOptions & { canPickMany: true },
    token?: IVSCodeCancellationToken,
  ): Thenable<T[] | undefined>;
  showQuickPick<T extends IVSCodeQuickPickItem>(
    items: T[] | Thenable<T[]>,
    options?: IVSCodeQuickPickOptions,
    token?: IVSCodeCancellationToken,
  ): Thenable<T | undefined>;
  showInputBox(options?: IVSCodeInputBoxOptions, token?: IVSCodeCancellationToken): Thenable<string | undefined>;
  showTextDocument(
    document: IVSCodeTextDocument | IVSCodeUri,
    options?: IVSCodeTextDocumentShowOptions,
  ): Thenable<IVSCodeTextEditor>;
}
