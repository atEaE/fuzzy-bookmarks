import { IVSCodeExtensionContext } from '../vscode';

export interface IExtensionManager {
  activate(context: IVSCodeExtensionContext): void;
}
