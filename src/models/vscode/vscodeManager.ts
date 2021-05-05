import { IVSCodeCommands } from './vscodeCommands';
import { IVSCodeUriHelper } from './vscodeUriHelper';
import { IVSCodeWindow } from './vscodeWindow';
import { IVSCodeWorkspace } from './vscodeWorkspace';

export interface IVSCodeManager {
  version: string;
  commands: IVSCodeCommands
  window: IVSCodeWindow;
  workspace: IVSCodeWorkspace;
  urlHelper: IVSCodeUriHelper;
}
