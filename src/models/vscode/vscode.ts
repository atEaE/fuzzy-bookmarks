import { IVSCodeCommands } from './vscodeCommands';
import { IVSCodeWindow } from './vscodeWindow';
import { IVSCodeWorkspace } from './vscodeWorkspace';

export interface IVSCode {
  version: string;
  window: IVSCodeWindow;
  commands: IVSCodeCommands;
  workspace: IVSCodeWorkspace;
}
