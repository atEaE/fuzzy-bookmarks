import * as models from './models';
import { CompositionService } from './services/compositionService';

/**
 * Activate the extension.
 * @param context ExtensionContext
 */
export function activate(context: models.IVSCodeExtensionContext) {
  const service = new CompositionService();
  const extensionManager = service.get<models.IExtensionManager>(models.SYMBOLS.IExtensionManager);
  extensionManager.activate(context);
}

/**
 * this method is called when your vscode is closed
 */
export function deactivate() {
  // no code here at the moment
}
