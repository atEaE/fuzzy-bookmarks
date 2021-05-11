import * as models from '../models';

/**
 * Class for managing extensions
 */
export class ExtensionManager implements models.IExtensionManager {
  constructor(
    private vscodeManager: models.IVSCodeManager,
    private commandManager: models.ICommandManager,
    private configManager: models.IConfigManager
  ) {
    if (!vscodeManager) {
      throw new ReferenceError(`'vscode' not set to an instance`);
    }
    if (!commandManager) {
      throw new ReferenceError(`'commandManager' not set to an instance`);
    }
  }

  /**
   * Activate vscode extension.
   * @param context vscode extension context.
   */
  public activate(context: models.IVSCodeExtensionContext): void {
    this.registerCommands(context);
  }

  /**
   * Performs the command registration process.
   * @param context vscode exetension context.
   */
  private registerCommands(context: models.IVSCodeExtensionContext) {
    Object.entries(models.CommandNames).forEach(([_, value]) => {
      let checkCmd = this.commandManager.get(value);
      if (!checkCmd) {
        throw new ReferenceError(`${value} no set to an instance`)
      }
      let command = checkCmd
      let disposable = this.vscodeManager.commands.registerCommand(command.name(), (uri: models.IVSCodeUri) => {
        let execArgs: models.IVSCodeExecutableArguments = {
          uri,
        };
        try {
          command.execute(execArgs, this.configManager);
        } catch (e) {
          this.vscodeManager.window.showErrorMessage(e.message);
        }
      })
      context.subscriptions.push(disposable);
    })
  }
}
