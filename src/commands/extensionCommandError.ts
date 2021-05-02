import * as models from '../models';

export class ExtensionCommandError implements models.ICommandError {
  public message: string;
  constructor(message: string) {
    this.message = message;
  }
}
