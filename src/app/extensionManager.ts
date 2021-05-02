import * as models from '../models';

/**
 * Class for managing extensions
 */
export class ExtensionManager implements models.IExtensionManager {
  constructor(private vscode: models.IVSCode) {
    if (!vscode) {
      throw new ReferenceError(`'vscode' not set to an instance`);
    }
  }

  public activate(): void {
    this.vscode.window.showInformationMessage('Hello world!')
  }
}
