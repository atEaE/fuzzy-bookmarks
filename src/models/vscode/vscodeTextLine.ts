import { IVSCodeRange } from './vscodeRange';

export interface IVSCodeTextLine {
  readonly lineNumber: number;
  readonly text: string;
  readonly range: IVSCodeRange;
  readonly rangeIncludingLineBreak: IVSCodeRange;
  readonly firstNonWhitespaceCharacterIndex: number;
  readonly isEmptyOrWhitespace: boolean;
}
