import { IVSCodeWorkspaceFolder } from './vscodeWorkspaceFolder';

export interface IVSCodeWorkspace {
  /**
   * List of workspace folders that are open in VS Code. `undefined when no workspace
   * has been opened.
   *
   * Refer to https://code.visualstudio.com/docs/editor/workspaces for more information
   * on workspaces in VS Code.
   *
   * *Note* that the first entry corresponds to the value of `rootPath`.
   */
  workspaceFolders: readonly IVSCodeWorkspaceFolder[] | undefined;
}
