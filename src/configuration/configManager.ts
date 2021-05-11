import * as path from 'path';
import * as fs from 'fs';
import * as fileutils from '../utils/file';

// ok
import * as models from '../models';

const CONFIG_CATEGORY = 'fzb';

export class ConfigManager implements models.IConfigManager {
  private filename: string = 'bookmarks.json';
  private config: models.IVSCodeWorkspaceConfiguration;
  constructor(private vscodeManager: models.IVSCodeManager) {
    if (!vscodeManager) {
      throw new ReferenceError(`'vscode' not set to an instance`);
    }
    this.config = this.vscodeManager.workspace.getConfiguration(CONFIG_CATEGORY);
  }

  /**
   * Returns the directory path to save the bookmark.
   * @returns saveBookmarkDir
   */
  public saveDirectoryPath(): string | undefined {
    return this.config.get<string>(models.ConfigurationKeys.saveBookmarkDir);
  }

  /**
   * Returns the default file name where the bookmarks are saved.
   * @returns defaultFileName
   */
  public defaultFileName(): string {
    return this.filename;
  }

  /**
   * Returns the Open method of the directory.
   * @returns open type.
   */
  public directoryOpenType(): models.DirectoryOpenType | undefined {
    return this.config.get(models.ConfigurationKeys.directoryOpenType);
  }

  /**
   * Returns the full path of the Bookmark file.
   * @returns bookmarkFullPath
   */
  public defaultBookmarkFullPath(): string | undefined {
    var dir = this.saveDirectoryPath();
    var file = this.defaultFileName();
    if (dir && file) {
      return path.join(dir, file);
    }
    return undefined;
  }

  /**
   * Evaluate the validity of Fuzzy Bookmark setting information.
   */
  public validate(): [boolean, models.IInValidReason] {
    // Checking the setting values
    if (!this.saveDirectoryPath() || !this.saveDirectoryPath()?.trim()) {
      return [
        false,
        {
          // eslint-disable-next-line max-len
          error: `Set the directory path where Bookmarks will be stored to "${CONFIG_CATEGORY + models.ConfigurationKeys.saveBookmarkDir}" .`,
        },
      ];
    }

    if (!fs.existsSync(fileutils.resolveHome(this.saveDirectoryPath()))) {
      return [
        false,
        {
          // eslint-disable-next-line max-len
          error: `The configured folder(${this.saveDirectoryPath()}) does not exist. Execute "FzB: Setup Fuzzy Bookmarks" or create a folder.`,
        },
      ];
    }
    if (!fs.existsSync(fileutils.resolveHome(this.defaultBookmarkFullPath()))) {
      return [
        false,
        {
          // eslint-disable-next-line max-len
          error: `The configured file(${this.defaultBookmarkFullPath()}) does not exist. Execute "FzB: Setup Fuzzy Bookmarks".`,
        },
      ];
    }
    return [true, { error: '' }];
  }
}
