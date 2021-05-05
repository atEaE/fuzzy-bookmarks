import { IVScodeEvent } from './vscodeEvent';

export interface IVSCodeCancellationToken {
  isCancellationRequested: boolean;
  onCancellationRequested: IVScodeEvent<any>;
}
