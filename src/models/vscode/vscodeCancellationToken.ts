import { IVScodeEvent } from './vscodeEvent';

export interface IVSCodeCancellationToken {
  /**
   * Is `true` when the token has been cancelled, `false` otherwise.
   */
  isCancellationRequested: boolean;

  /**
   * An [event](#Event) which fires upon cancellation.
   */
  onCancellationRequested: IVScodeEvent<any>;
}
