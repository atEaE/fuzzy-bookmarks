import * as vscode from 'vscode';
import * as webview from 'open'

export function searchExecute(...args: any[]) {
    var options: vscode.QuickPickOptions = { matchOnDescription: true };

    var item1: vscode.QuickPickItem = { label: "$(globe)", description: "https://github.com/editorconfig/editorconfig-vscode/blob/master/package.json" };
    var item2: vscode.QuickPickItem = { label: "$(globe)", description: "https://github.com/tatosjb/vscode-fuzzy-search/blob/master/src/fuzzy-search.ts" };
    var item3: vscode.QuickPickItem = { label: "$(globe)", description: "https://github.com/atEaE/vscode-my-cheatsheet" }

    vscode.window.showQuickPick([item1, item2, item3], options).then((item) => {
        if (item && item.description) {
            webview(item.description)
        }
    })
}