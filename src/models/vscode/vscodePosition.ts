export interface IVSCodePosition {
  readonly line: number;
  readonly character: number;
  isBefore(other: IVSCodePosition): boolean;
  isBeforeOrEqual(other: IVSCodePosition): boolean;
  isAfter(other: IVSCodePosition): boolean;
  isAfterOrEqual(other: IVSCodePosition): boolean;
  isEqual(other: IVSCodePosition): boolean;
  compareTo(other: IVSCodePosition): number;
  translate(lineDelta?: number, characterDelta?: number): IVSCodePosition;
  translate(change: { lineDelta?: number; characterDelta?: number; }): IVSCodePosition;
  with(line?: number, character?: number): IVSCodePosition;
  with(change: { line?: number; character?: number; }): IVSCodePosition;
}
