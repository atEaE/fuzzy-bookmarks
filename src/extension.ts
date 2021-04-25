import * as vscode from 'vscode';
import { ContributesCommands, ContributesConfig, FzbConfig } from './contributes';
import * as commands from './commands';

/**
 * Activate the extension.
 * @param context ExtensionContext
 */
export function activate(context: vscode.ExtensionContext) {
	// setup message.
	var config = ContributesConfig.getFzBConfig();
	var [ok, reason] = config.validate();
	if (!ok) {
		vscode.window.showWarningMessage(reason.error);
	}

	// register commands
	let disposable = vscode.commands.registerCommand(ContributesCommands.SHOW_BOOKMARKS, () => { registerWrapper(config, commands.showExecute); });
	context.subscriptions.push(disposable);
}

/**
 * Wraps the Command registration process and provides Error handling.
 * @param config Fuzzy Bookmark configuration
 * @param delegate delegate function
 */
function registerWrapper(config: FzbConfig, delegate: (config: FzbConfig) => void) {
	try {
		delegate(config);
	} catch (e) {
		vscode.window.showErrorMessage(e);
	}
}

export function deactivate() { }
