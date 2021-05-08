import { DirectoryOpenType } from '../contributions';
import { IInValidReason } from './invalidReason';

export interface IConfigManager {
  saveDirectoryPath(): string | undefined;
  defaultFileName(): string | undefined;
  directoryOpenType(): DirectoryOpenType | undefined;
  defaultBookmarkFullPath(): string | undefined;
  validate(): [boolean, IInValidReason];
}
