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
	let showDisposable = vscode.commands.registerCommand(ContributesCommands.SHOW_BOOKMARKS, () => { registerWrapper(config, commands.showExecute); });
	let registerDisposable = vscode.commands.registerCommand(ContributesCommands.REGISTER_BOOKMARKS, () => { registerWrapper(config, commands.registerExecute); });
	let removeDisposable = vscode.commands.registerCommand(ContributesCommands.REMOVE_BOOKMARKS, () => { registerWrapper(config, commands.removeExecute); });
	let exportDisposable = vscode.commands.registerCommand(ContributesCommands.EXPORT_BOOKMARKS, () => { registerWrapper(config, commands.exportExecute); });
	let setupDisposable = vscode.commands.registerCommand(ContributesCommands.SETUP_BOOKMARKS, () => { registerWrapper(config, commands.setupExecute); });
	context.subscriptions.push(showDisposable);
	context.subscriptions.push(registerDisposable);
	context.subscriptions.push(removeDisposable);
	context.subscriptions.push(exportDisposable);
	context.subscriptions.push(setupDisposable);
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
		vscode.window.showErrorMessage(e.message);
	}
}

export function deactivate() { }
