import * as vscode from 'vscode';
import * as inversify from 'inversify';
import 'reflect-metadata';
import * as models from '../models';
import { ExtensionManager } from '../app/extensionManager';


type Class = new (...args: any[]) => unknown;

/**
 * Service for creating configuration information for extensions.
 */
export class CompositionService {
    private readonly container: inversify.Container;
    private injectableClasses: ReadonlyArray<[Class, Array<inversify.interfaces.ServiceIdentifier<any>>]> = [];

    constructor() {
        this.container = new inversify.Container({ defaultScope: 'Singleton' });
        this.initInjectionMap();
        this.initDecorations();
        this.initBinding();
    }

    /**
     * Get the instance of the specified manager.
     * @param managerIdentifier identifier
     * @returns manager
     */
    public get<T>(managerIdentifier: inversify.interfaces.ServiceIdentifier<T>): T {
        return this.container.get<T>(managerIdentifier);
    }

    /**
     * dispose
     */
    public dispose(): void {
        this.injectableClasses
            .map(ijc => ijc[0])
            .forEach(diClass => {
                Reflect.deleteMetadata(inversify.METADATA_KEY.PARAM_TYPES, diClass);
                Reflect.deleteMetadata(inversify.METADATA_KEY.TAGGED, diClass);
            });
    }

    /**
     * Initialize injection mapping
     */
    private initInjectionMap(): void {
        this.injectableClasses = [
            [ExtensionManager, [models.SYMBOLS.IVSCode]],
        ];
        this.dispose();
    }

    /**
     * Initialize decorate classes.
     */
    private initDecorations(): void {
        this.injectableClasses.forEach(ijc => {
            // Annotate the classes for which dependencies are to be injected.
            const diClass = ijc[0];
            inversify.decorate(inversify.injectable(), diClass);

            const ijParams = ijc[1];
            ijParams.forEach((id, index) => {
                // @ts-ignore
                inversify.decorate(inversify.inject(id), diClass, index);
            });
        });
    };

    /**
     * Initialize binding
     */
    private initBinding(): void {
        const bind = <T>(
            identifier: inversify.interfaces.ServiceIdentifier<T>
        ): inversify.interfaces.BindingToSyntax<T> => this.container.bind<T>(identifier);

        bind<models.IVSCode>(models.SYMBOLS.IVSCode).toConstantValue(vscode);
        bind<models.IExtensionManager>(models.SYMBOLS.IExtensionManager).to(ExtensionManager);
    }
}
