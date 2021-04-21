import * as vscode from 'vscode';
import { Commands } from './contributes';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "fuzzy-bookmarks" is now active!');

	let disposable = vscode.commands.registerCommand(Commands.SEARCH_BOOKMARKS, () => {
		vscode.window.showInformationMessage('Hello World from fuzzy-bookmarks!');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
