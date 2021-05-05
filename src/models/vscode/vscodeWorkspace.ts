import { IVSCodeWorkspaceFolder } from './vscodeWorkspaceFolder';
import { IVSCodeWorkspaceConfiguration, VSCodeConfigurationScope } from './vscodeWorkspaceConfiguration';

export interface IVSCodeWorkspace {
  workspaceFolders: readonly IVSCodeWorkspaceFolder[] | undefined;
  getConfiguration(section?: string | undefined, scope?: VSCodeConfigurationScope):  IVSCodeWorkspaceConfiguration;
}
