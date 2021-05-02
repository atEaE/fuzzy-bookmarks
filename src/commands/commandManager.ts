import * as models from '../models';
import { Export } from './export';
import { Setup } from './setup';
import { Show } from './show';

/**
 * Class for managing commands
 */
export class CommandManager implements models.ICommandManager {
  private commands: models.ICommand[] = [];
  constructor(private vscode: models.IVSCode, private bookmarkManager: models.IBookmarkManager) {
    if (!vscode) {
      throw new ReferenceError(`'vscode' not set to an instance`);
    }
    if (!bookmarkManager) {
      throw new ReferenceError(`'bookmarkManager' not set to an instance`);
    }
    this.init();
  }

  public get(id: string): models.ICommand | undefined {
    return this.commands.find(c => c.name() === id);
  }

  /**
   * Initialize command manager.
   */
  private init(): void {
    this.commands.push(new Show(this.vscode, this.bookmarkManager));
    this.commands.push(new Export(this.vscode, this.bookmarkManager));
    this.commands.push(new Setup(this.vscode, this.bookmarkManager));
  }
}
