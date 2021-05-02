import { IVSCodeExecutableArguments } from '../vscode';
import { IConfigManager } from '../configuration';
export interface ICommand {
  name: () => string;
  execute: (execArgs: IVSCodeExecutableArguments, configManager: IConfigManager) => void;
}
