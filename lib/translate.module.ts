import { Module } from "@nestjs/common";
import { DefaultTranslationParser, TranslateParser } from "./parser/translate.parser";

@Module({
    providers: [{ provide: TranslateParser, useClass: DefaultTranslationParser }]
})
export class TranslateModule {
    public static forRoot() {
        return {
            imports: [],
            providers: [],
            exports: []
        };
    }
}
