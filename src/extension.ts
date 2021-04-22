import * as vscode from 'vscode';
import { ContributesCommands, ContributesConfig } from './contributes';
import * as commands from './commands';

export function activate(context: vscode.ExtensionContext) {
	// setup message.
	var config = ContributesConfig.getFzBConfig();
	if (!config.defaultDir()) {
		vscode.window.showWarningMessage(`Set the directory path where Bookmarks will be stored to "${ContributesConfig.CONFIG_KEY.defaultDir}" .`);
	}

	let disposable = vscode.commands.registerCommand(ContributesCommands.SEARCH_BOOKMARKS, () => { commands.searchExecute(config); });
	context.subscriptions.push(disposable);
}

export function deactivate() { }
