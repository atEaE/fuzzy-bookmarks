import { IVSCodeUri } from './vscodeUri';

export interface IVSCodeUriHelper {
  file(path: string): IVSCodeUri;
}
