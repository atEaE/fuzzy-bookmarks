import * as models from '../models';

export class ConfigManager implements models.IConfigManager {
  private configuration: 
  constructor(private vscode: models.IVSCode) {
    if (!vscode) {
      throw new ReferenceError(`'vscode' not set to an instance`);
    }
  }
}