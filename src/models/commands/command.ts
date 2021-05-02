import * as vscode from '../vscode';

export interface ICommand {
  name: () => string;
  execute: (execArgs: vscode.IVSCodeExecutableArguments) => void;
}
