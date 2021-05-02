import { IVSCodeWorkspaceFolder } from './vscodeWorkspaceFolder';
import { IVSCodeWorkspaceConfiguration, VSCodeConfigurationScope } from './vscodeWorkspaceConfiguration';

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

  /**
   * Get a workspace configuration object.
   *
   * When a section-identifier is provided only that part of the configuration
   * is returned. Dots in the section-identifier are interpreted as child-access,
   * like `{ myExt: { setting: { doIt: true }}}` and `getConfiguration('myExt.setting').get('doIt') === true`.
   *
   * When a scope is provided configuration confined to that scope is returned.
   * Scope can be a resource or a language identifier or both.
   *
   * @param section A dot-separated identifier.
   * @param scope A scope for which the configuration is asked for.
   * @return The full configuration or a subset.
   */
  getConfiguration(section?: string | undefined, scope?: VSCodeConfigurationScope):  IVSCodeWorkspaceConfiguration;
}
