import { IVSCodeDisposable } from './vscodeDisposable';

export type IVScodeEvent<T> = (
  listener: (e: T) => any,
  thisArgs?: any,
  disposables?: IVSCodeDisposable[],
) => IVSCodeDisposable;
