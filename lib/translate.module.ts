import { Module } from "@nestjs/common";
import { TranslateLoader } from "./loader/translate.loader";
import { DefaultTranslationParser, TranslateParser } from "./parser/translate.parser";
import { TranslateService } from "./translate.service";

@Module({
    providers: [
        { provide: TranslateParser, useClass: DefaultTranslationParser },
        TranslateLoader,
        TranslateService
    ],
    exports: [
        TranslateService
    ]
})
export class TranslateModule {
}
