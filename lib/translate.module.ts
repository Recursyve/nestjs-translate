import { DynamicModule, Global, Module } from "@nestjs/common";
import { TranslateLoader } from "./loader/translate.loader";
import { DefaultTranslationParser, TranslateParser } from "./parser/translate.parser";
import { TranslateService } from "./translate.service";

@Global()
@Module({})
export class TranslateModule {
    public static forRoot(prefix: string): DynamicModule {
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
