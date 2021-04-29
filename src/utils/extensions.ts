export class FzbExtensionsError {
    name: string;
    public message: string;
    constructor(message: string) {
        this.name = "FzbExtensionsError";
        this.message = message;
    }
}