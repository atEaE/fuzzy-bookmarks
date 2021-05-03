import * as models from '../models';

export class VSCodeManager implements models.IVSCodeManager {
  constructor(private vscode: models.IVSCode, private uriHelper: models.IVSCodeUriHelper) {
    if (!vscode) {
      throw new ReferenceError(`'vscode' not set to an instance`);
    }
  }

  public get version(): string {
    return this.vscode.version;
  }

  public get commands(): models.IVSCodeCommands {
    return this.vscode.commands;
  }

  public get window(): models.IVSCodeWindow {
    return this.vscode.window;
  }

  public get workspace(): models.IVSCodeWorkspace {
    return this.vscode.workspace;
  }

  public get urlHelper(): models.IVSCodeUriHelper {
    return this.uriHelper;
  }
}
