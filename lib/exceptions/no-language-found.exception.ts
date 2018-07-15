export class NoLanguageFoundException extends Error {
    constructor(public lang: string, public path: string) {
        super();
    }
}