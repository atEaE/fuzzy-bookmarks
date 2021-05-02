import { IVSCodeUri } from './vscodeUri';

export interface IVSCodeWorkspaceFolder {
  /**
   * The associated uri for this workspace folder.
   *
   * *Note:* The [Uri](#Uri)-type was intentionally chosen such that future releases of the editor can support
   * workspace folders that are not stored on the local disk, e.g. `ftp://server/workspaces/foo`.
   */
  readonly uri: IVSCodeUri;

  /**
   * The name of this workspace folder. Defaults to
   * the basename of its [uri-path](#Uri.path)
   */
  readonly name: string;

  /**
   * The ordinal number of this workspace folder.
   */
  readonly index: number;
}
