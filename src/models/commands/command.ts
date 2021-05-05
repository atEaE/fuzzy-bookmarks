import { IVSCodeExecutableArguments } from '../vscode';
import { IConfigManager } from '../configuration';
import { IBookmarkManager } from '../bookmark';
export interface ICommand {
  name: () => string;
  execute: (
    execArgs: IVSCodeExecutableArguments,
    configManager: IConfigManager,
    bookmarkManager: IBookmarkManager
  ) => void;
}
