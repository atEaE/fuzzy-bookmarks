import { EndOfLine } from './vscodeEnum';
import { IVSCodeUri } from './vscodeUri';
import { IVSCodeRange } from './vscodeRange';
import { IVSCodePosition } from './vscodePosition';
import { IVSCodeTextLine } from './vscodeTextLine';

export interface IVSCodeTextDocument {
  readonly uri: IVSCodeUri;
  readonly fileName: string;
  readonly isUntitled: boolean;
  readonly languageId: string;
  readonly version: number;
  readonly isDirty: boolean;
  readonly isClosed: boolean;
  readonly lineCount: number;
  readonly eol: EndOfLine
  save(): Thenable<boolean>;
  lineAt(position: number | IVSCodePosition): IVSCodeTextLine;
  offsetAt(position: IVSCodePosition): number;
  positionAt(offset: number): IVSCodePosition;
  getText(range?: IVSCodeRange): string;
  getWordRangeAtPosition(position: IVSCodePosition, regex?: RegExp): IVSCodeRange | undefined;
  validateRange(range: IVSCodeRange): IVSCodeRange;
  validatePosition(position: IVSCodePosition): IVSCodePosition;
}
