import * as vscode from 'vscode';
import { IFzbConfig } from '../../contributes';
import { IVSCodeExecutableArguments } from './executableArguments';
import { IVSCodeExtensionContext } from './extensionContext';
import { IVSCodeUri } from './vscodeUri';

type CommandDelegate = (execArgs: IVSCodeExecutableArguments, config: IFzbConfig) => void;

/**
 * Command managements class
 */
export class CommandManager {
    /**
     * Register the command.
     * @param context vscode context.
     * @param config configuration
     * @param commandId command identify
     * @param delegate CommandDelegate
     */
    public register(context: IVSCodeExtensionContext, config: IFzbConfig, commandId: string, delegate: CommandDelegate) {
        let disposable = vscode.commands.registerCommand(commandId, (uri: IVSCodeUri) => {
            try {
                delegate({ uri }, config);
            } catch (e) {
                vscode.window.showErrorMessage(e.message);
            }
        });
        context.subscriptions.push(disposable);
    }
}
