import { ViewColumn } from 'vscode';

export interface IVSCodeTextEditor {
  readonly viewColumn?: ViewColumn
  show(column?: ViewColumn): void;
  hide(): void;
}
