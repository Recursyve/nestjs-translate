import { DynamicModule, Global, Module } from "@nestjs/common";
import { TranslateLoader } from "./loader/translate.loader";
import { TRANSLATE_OPTIONS, TranslateOptionsModel } from "./models/translate-options.model";
import { DefaultTranslationParser, TranslateParser } from "./parser/translate.parser";
import { TranslateService } from "./translate.service";

@Global()
@Module({})
export class TranslateModule {
    public static forRoot(prefix: string, options?: TranslateOptionsModel): DynamicModule {
        return {
            module: TranslateModule,
            providers: [
                { provide: TRANSLATE_OPTIONS, useValue: options || { defaultLang: "en" } },
                { provide: TranslateParser, useClass: DefaultTranslationParser },
                { provide: TranslateLoader, useValue: new TranslateLoader(prefix) },
                TranslateService
            ],
            exports: [
                TranslateService
            ]
        };
    }

    public static forFeature(prefix: string): DynamicModule {
        return {
            module: TranslateModule,
            providers: [
                { provide: TranslateParser, useClass: DefaultTranslationParser },
                { provide: TranslateLoader, useValue: new TranslateLoader(prefix) },
                TranslateService
            ],
            exports: [
                TranslateService
            ]
        };
    }
}
