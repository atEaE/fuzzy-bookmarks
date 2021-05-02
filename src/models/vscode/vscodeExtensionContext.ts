export interface IVSCodeExtensionContext {
    readonly subscriptions: Array<{ dispose(): any }>;
}
