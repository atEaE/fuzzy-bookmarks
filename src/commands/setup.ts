import * as vscode from 'vscode';
import * as fs from 'fs';
import * as fileutils from '../utils/file';
import { FzbConfig } from '../contributes';
import { cerateBookmarksInfo } from '../models/bookmark';

/**
 * Execute the process of setup command.
 * @param config Fuzzy Bookmark configuration.
 * @returns void
 */
export function setupExecute(config: FzbConfig): void {
    vscode.window.showInputBox({ prompt: `Create a file "${config.defaultBookmarkFullPath()}" as setup. If you want to continue, enter "y|yes".` })
        .then(input => {
            if (input === "y" || input === "yes") {
                try {
                    // check folder.
                    if (fs.existsSync(fileutils.resolveHome(config.defaultDir()))) {
                        vscode.window.showInformationMessage("OK! Confirmed the existence of the destination folder.");
                    } else {
                        fs.mkdirSync(fileutils.resolveHome(config.defaultDir()));
                        vscode.window.showInformationMessage(`OK! Create a new destination folder(${config.defaultDir()}).`);
                    }

                    // check file.
                    if (fs.existsSync(fileutils.resolveHome(config.defaultBookmarkFullPath()))) {
                        vscode.window.showInformationMessage("OK! Confirmed the existence of the destination file.");
                    } else {
                        var blob = JSON.stringify(cerateBookmarksInfo());
                        fs.writeFileSync(fileutils.resolveHome(config.defaultBookmarkFullPath()), blob);
                        vscode.window.showInformationMessage(`OK! Create a new destination folder(${config.defaultBookmarkFullPath()}).`);
                    }
                    vscode.window.showInformationMessage("Setup completed! ");
                } catch (e) {
                    vscode.window.showErrorMessage("An error occurred during setup." + e.message);
                }
            } else {
                vscode.window.showWarningMessage("Abort setup.");
            }
        });
}