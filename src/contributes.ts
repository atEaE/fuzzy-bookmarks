import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as fileutils from './utils/file';
import { IInValidReason, IValidateObject } from './utils/validate';

/**
 * Fuzzy Bookmark configuration.
 */
export interface IFzbConfig extends IValidateObject {
  defaultDir(): string | undefined;
  defaultFileName(): string | undefined;
  defaultBookmarkFullPath(): string | undefined;
  directoryOpenType(): DirectoryOpenType | undefined;
  validate(): [boolean, IInValidReason];
}

/**
 * Contributes commands.
 */
export namespace ContributesCommands {
  export const SHOW_BOOKMARKS = 'fzb.showBookmarks';
  export const REGISTER_BOOKMARKS = 'fzb.registerBookmarks';
  export const REMOVE_BOOKMARKS = 'fzb.removeBookmarks';
  export const EXPORT_BOOKMARKS = 'fzb.exportBookmarks';
  export const SETUP_BOOKMARKS = 'fzb.setupBookmarks';
}

/**
 * Directory open type.
 */
type DirectoryOpenType = 'terminal' | 'explorer';

/**
 * Contributes configuration.
 */
export namespace ContributesConfig {
  const CONFIG_CATEGORY = 'fzb';
  const DEFAULT_DIR = 'defaultBookmarkDir';
  const DEFAULT_FILENAME = 'defaultBookmarkFileName';
  const DIRECTORY_OPEN_TYPE = 'directoryOpenType';

  /**
   * Key names for settings that can be configured in Fuzzy Bookmarks
   */
  export const CONFIG_KEY = {
    defaultDir: CONFIG_CATEGORY + '.' + DEFAULT_DIR,
    defaultFileName: CONFIG_CATEGORY + '.' + DEFAULT_FILENAME,
    directoryOpenType: CONFIG_CATEGORY + '.' + DIRECTORY_OPEN_TYPE,
  };

  /**
   * Fuzzy Bookmark configuration class.
   */
  class FzbConfig {
    private config: vscode.WorkspaceConfiguration;
    constructor(config: vscode.WorkspaceConfiguration) {
      this.config = config;
    }

    /**
     * Returns the default directory path to save the bookmark.
     * @returns defaultBookmarkDir
     */
    public defaultDir(): string | undefined {
      return this.config.get(DEFAULT_DIR);
    }

    /**
     * Returns the default file name where the bookmarks are saved.
     * @returns defaultFileName
     */
    public defaultFileName(): string | undefined {
      return this.config.get(DEFAULT_FILENAME);
    }

    /**
     * Returns the Open method of the directory.
     * @returns open type.
     */
    public directoryOpenType(): DirectoryOpenType | undefined {
      return this.config.get(DIRECTORY_OPEN_TYPE);
    }

    /**
     * Returns the full path of the Bookmark file.
     * @returns bookmarkFullPath
     */
    public defaultBookmarkFullPath(): string | undefined {
      var dir = this.defaultDir();
      var file = this.defaultFileName();
      if (dir && file) {
        return path.join(dir, file);
      }
      return undefined;
    }

    /**
     * Evaluate the validity of Fuzzy Bookmark setting information.
     */
    public validate(): [boolean, IInValidReason] {
      // Checking the setting values
      if (!this.defaultDir() || !this.defaultDir()?.trim()) {
        return [
          false,
          { error: `Set the directory path where Bookmarks will be stored to "${CONFIG_KEY.defaultDir}" .` },
        ];
      }
      if (!this.defaultFileName() || !this.defaultFileName()?.trim()) {
        return [false, { error: `Set the file name for saving bookmarks to "${CONFIG_KEY.defaultFileName}" .` }];
      }

      if (!fs.existsSync(fileutils.resolveHome(this.defaultDir()))) {
        return [
          false,
          {
            // eslint-disable-next-line max-len
            error: `The configured folder(${this.defaultDir()}) does not exist. Execute "FzB: Setup Fuzzy Bookmarks" or create a folder.`,
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

  /**
   * Get the configuration for Fuzzy Bookmarks.
   * @returns FzbConfig
   */
  export function getFzBConfig(): FzbConfig {
    return new FzbConfig(vscode.workspace.getConfiguration(CONFIG_CATEGORY));
  }
}
