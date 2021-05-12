import * as models from '../models';

export class VSCodeManager implements models.IVSCodeManager {
  constructor(private vscode: models.IVSCode, private uriHelper: models.IVSCodeUriHelper) {
    if (!vscode) {
      throw new ReferenceError(`'vscode' not set to an instance`);
    }
  }

  /**
   * get version infomation.
   */
  public get version(): string {
    return this.vscode.version;
  }

  /**
   * get commands modules.
   */
  public get commands(): models.IVSCodeCommands {
    return this.vscode.commands;
  }

  /**
   * get window modules.
   */
  public get window(): models.IVSCodeWindow {
    return this.vscode.window;
  }

  /**
   * get workspace modules.
   */
  public get workspace(): models.IVSCodeWorkspace {
    return this.vscode.workspace;
  }

  /**
   * get urlHelper modules.
   */
  public get urlHelper(): models.IVSCodeUriHelper {
    return this.uriHelper;
  }

  /**
   * get current root folder
   */
  public get currentRootFolder(): string | undefined{
    return this.workspace.workspaceFolders
        ? this.workspace.workspaceFolders[0].uri.path
        : undefined;
  }
}
