import { IVSCodeCommands } from './vscodeCommand';
import { IVSCodeWindow } from './vscodeWindow';
import { IVSCodeWorkspace } from './vscodeWorkspace';

export interface IVSCode {
  /**
   * The version of the editor.
   */
  version: string;

  /**
   * Instance for dealing with the current window of the editor. That is visible
   * and active editors, as well as, UI elements to show messages, selections, and
   * asking for user input.
   */
  window: IVSCodeWindow;

  /**
   * Instance for dealing with commands. In short, a command is a function with a
   * unique identifier. The function is sometimes also called _command handler_
   */
  commands: IVSCodeCommands;

  /**
   * Instance for dealing with the current workspace. A workspace is the collection of one
   * or more folders that are opened in a VS Code window (instance).
   */
  workspace: IVSCodeWorkspace;
}
