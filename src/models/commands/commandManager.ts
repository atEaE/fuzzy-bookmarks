import { ICommand } from './command';

export interface ICommandManager {
  get(id: string): ICommand | undefined;
}
