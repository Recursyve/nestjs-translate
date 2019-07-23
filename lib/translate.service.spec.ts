import { TranslateLoader } from "./loader/translate.loader";
import { DefaultTranslationParser } from "./parser/translate.parser";
import { TranslateService } from "./translate.service";

describe('TranslateService', () => {
    let service: TranslateService;
    beforeAll(() => {
        service = new TranslateService(
            {
                defaultLang: "en"
            },
            new TranslateLoader(__dirname + '/../assets/i18n'),
            new DefaultTranslationParser()
        );
    });

    it('get should return the translated value', async () => {
        const translations = await service.get('test').toPromise();
        expect(translations).toBe("This is a simple test");
    });

    it('get should return the translated value with params in it', async () => {
        const translations = await service.get('interpolation', { value: "valueI" }).toPromise();
        expect(translations).toBe("This value has one parameter => valueI");
    });

    it('get should return the translated value with lang overwrite', async () => {
        const translations = await service.get('fr', 'test').toPromise();
        expect(translations).toBe("Ceci est un simple teste");
    });

    it('get should return the translated value with params in it with lang overwrite', async () => {
        const translations = await service.get('en', 'interpolation', { value: "valueI" }).toPromise();
        expect(translations).toBe("This value has one parameter => valueI");
    });
});
