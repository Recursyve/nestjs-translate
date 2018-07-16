import { NoLanguageFoundException } from "../exceptions/no-language-found.exception";
import { TranslateLoader } from './translate.loader';

describe('TranslateLoader', () => {
    let loader: TranslateLoader;
    beforeAll(() => {
        loader = new TranslateLoader(__dirname + '/../../assets/i18n');
    });

    it('loadLang should load the translation of the given lang', async () => {
        const translations = await loader.loadLang('en').toPromise();
        expect(translations).toStrictEqual({
            test: "This is a simple tests",
            translate: "This library should help you to support i18n with NestJs",
            interpolation: "This value has one parameter => {{ value }}"
        });
    });

    it('loadLang should throw an exception if the language is not defined', async () => {
        try {
            await loader.loadLang('xx').toPromise();
        } catch (e) {
            expect(e).toBeInstanceOf(NoLanguageFoundException);
            expect(e.lang).toBe("xx");
        }
    });
});