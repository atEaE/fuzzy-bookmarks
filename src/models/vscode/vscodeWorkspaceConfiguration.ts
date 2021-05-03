import { IVSCodeUri } from './vscodeUri';

export type VSCodeConfigurationScope = IVSCodeUri;

export interface IVSCodeWorkspaceConfiguration {
  get<T>(section: string): T | undefined;
  get<T>(section: string, defaultValue: T): T;
  has(section: string): boolean;
}
