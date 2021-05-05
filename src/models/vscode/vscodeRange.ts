import { IVSCodePosition } from './vscodePosition';

export interface IVSCodeRange {
  readonly start: IVSCodePosition;
  readonly end: IVSCodePosition;
  isEmpty: boolean;
  isSingleLine: boolean;
  contains(positionOrRange: IVSCodePosition | IVSCodeRange): boolean;
  isEqual(other: IVSCodeRange): boolean;
  intersection(range: IVSCodeRange): IVSCodeRange | undefined;
  union(other: IVSCodeRange): IVSCodeRange;
  with(start?: IVSCodePosition, end?: IVSCodePosition): IVSCodeRange;
  with(change: { start?: IVSCodePosition; end?: IVSCodePosition }): IVSCodeRange;
}
