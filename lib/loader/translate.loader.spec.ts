import { firstValueFrom } from "rxjs";
import { TranslateLoader } from "./translate.loader";

describe("TranslateLoader", () => {
    let loader: TranslateLoader;
    beforeAll(() => {
        loader = new TranslateLoader(__dirname + "/../../assets/i18n");
    });

    it("loadTranslations should load all the translation of the giving folder", async () => {
        const translations = await firstValueFrom(loader.loadTranslations());
        expect(translations).toStrictEqual({
            en: {
                test: "This is a simple test",
                translate: "This library should help you to support i18n with NestJs",
                interpolation: "This value has one parameter => {{ value }}"
            },
            fr: {
                test: "Ceci est un simple teste",
                translate: "Cette librairie devrait vous aider à supporter l'i18n avec NestJs",
                interpolation: "Cette valeur contient un paramètre => {{ value }}"
            }
        });
    });
});
