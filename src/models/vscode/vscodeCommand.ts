import { IVSCodeDisposable } from './vscodeDisposable';

export interface IVSCodeCommands {
  /**
   * Executes the command denoted by the given command identifier.
   *
   * * *Note 1:* When executing an editor command not all types are allowed to
   * be passed as arguments. Allowed are the primitive types `string`, `boolean`,
   * `number`, `undefined`, and `null`, as well as [`Position`](#Position),
   * [`Range`](#Range), [`Uri`](#Uri) and [`Location`](#Location).
   * * *Note 2:* There are no restrictions when executing commands that have been contributed
   * by extensions.
   *
   * @param command Identifier of the command to execute.
   * @param rest Parameters passed to the command function.
   * @return A thenable that resolves to the returned value of the given command. `undefined` when
   * the command handler function doesn't return anything.
   */
   executeCommand<T>(command: string, ...rest: any[]): Thenable<T | undefined>;

  /**
   * Registers a command that can be invoked via a keyboard shortcut,
   * a menu item, an action, or directly.
   *
   * Registering a command with an existing command identifier twice
   * will cause an error.
   *
   * @param command A unique identifier for the command.
   * @param callback A command handler function.
   * @param thisArg The `this` context used when invoking the handler function.
   * @return Disposable which unregisters this command on disposal.
   */
  registerCommand(command: string, callback: (...args: any[]) => any, thisArg?: any): IVSCodeDisposable;
}
