
import { IVSCodeRange } from './vscodeRange';
import { ViewColumn } from './vscodeEnum';

export interface IVSCodeTextDocumentShowOptions {
  viewColumn?: ViewColumn;
  preserveFocus?: boolean;
  preview?: boolean;
  selection?: IVSCodeRange;
}


