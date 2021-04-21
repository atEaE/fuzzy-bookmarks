import * as vscode from 'vscode';
import * as webview from 'open'
import { Commands } from './contributes';
import open = require('open');

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "fuzzy-bookmarks" is now active!');

	var options: vscode.QuickPickOptions = { matchOnDescription: true };

	var item1: vscode.QuickPickItem = { label: "$(globe)", description: "https://github.com/editorconfig/editorconfig-vscode/blob/master/package.json" };
	var item2: vscode.QuickPickItem = { label: "$(globe)", description: "https://github.com/tatosjb/vscode-fuzzy-search/blob/master/src/fuzzy-search.ts" };
	var item3: vscode.QuickPickItem = { label: "$(globe)", description: "https://github.com/atEaE/vscode-my-cheatsheet" };

	let disposable = vscode.commands.registerCommand(Commands.SEARCH_BOOKMARKS, () => {
		vscode.window.showQuickPick([item1, item2, item3], options).then((item) => {
			if (item && item.description) {
				webview(item.description)
			}
		})
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
