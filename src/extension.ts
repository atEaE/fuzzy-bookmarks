import * as vscode from 'vscode';
import { ContributesCommands, ContributesConfig, IFzbConfig } from './contributes';
import * as commands from './commands';
import * as models from './models';
import { CommandManager } from './models/vscode';
import { CompositionService } from './services/compositionService';

/**
 * Wraps the Command registration process and provides Error handling.
 * @param config Fuzzy Bookmark configuration
 * @param delegate delegate function
 */
function registerWrapper(config: IFzbConfig, delegate: (config: IFzbConfig) => void) {
  try {
    delegate(config);
  } catch (e) {
    vscode.window.showErrorMessage(e.message);
  }
}

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

  const service = new CompositionService();
  const extensionManager = service.get<models.IExtensionManager>(models.SYMBOLS.IExtensionManager);
  extensionManager.activate();

  var cmdManager = new CommandManager();
  cmdManager.register(context, config, ContributesCommands.REGISTER_BOOKMARKS, commands.registerExecute);

  // register commands
  let showDisposable = vscode.commands.registerCommand(ContributesCommands.SHOW_BOOKMARKS, () => {
    registerWrapper(config, commands.showExecute);
  });
  let removeDisposable = vscode.commands.registerCommand(ContributesCommands.REMOVE_BOOKMARKS, () => {
    registerWrapper(config, commands.removeExecute);
  });
  let exportDisposable = vscode.commands.registerCommand(ContributesCommands.EXPORT_BOOKMARKS, () => {
    registerWrapper(config, commands.exportExecute);
  });
  let setupDisposable = vscode.commands.registerCommand(ContributesCommands.SETUP_BOOKMARKS, () => {
    registerWrapper(config, commands.setupExecute);
  });
  context.subscriptions.push(showDisposable);
  context.subscriptions.push(removeDisposable);
  context.subscriptions.push(exportDisposable);
  context.subscriptions.push(setupDisposable);
}

/**
 * this method is called when your vscode is closed
 */
export function deactivate() {
  // no code here at the moment
}
