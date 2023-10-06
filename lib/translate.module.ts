import { DynamicModule, Global, Module, Scope } from "@nestjs/common";
import { TranslateLoader } from "./loader/translate.loader";
import { TRANSLATE_OPTIONS } from "./models/translate-options.model";
import { DefaultTranslationParser, TranslateParser } from "./parser/translate.parser";
import { TranslateStore } from "./store/translate.store";
import { TranslateService } from "./translate.service";

export interface TranslateModuleConfig {
    prefix: string;
    defaultLang?: string;
}

@Global()
@Module({})
export class TranslateModule {
    public static forRoot(config: TranslateModuleConfig): DynamicModule {
        return {
            module: TranslateModule,
            providers: [
                {
                    provide: TRANSLATE_OPTIONS, useValue: {
                        ...(config),
                        defaultLang: config.defaultLang || "en",
                        feature: false
                    }
                },
                { provide: TranslateParser, useClass: DefaultTranslationParser },
                { provide: TranslateLoader, useValue: new TranslateLoader(config.prefix) },
                TranslateStore,
                TranslateService
            ],
            exports: [
                TranslateService,
                TranslateStore
            ]
        };
    }

    public static forFeature(config: TranslateModuleConfig): DynamicModule {
        return {
            module: TranslateModule,
            providers: [
                {
                    provide: TRANSLATE_OPTIONS, useValue: {
                        ...config,
                        feature: true
                    }
                },
                { provide: TranslateParser, useClass: DefaultTranslationParser },
                { provide: TranslateLoader, useValue: new TranslateLoader(config.prefix) },
                { provide: TranslateService, useClass: TranslateService, scope: Scope.TRANSIENT }
            ],
            exports: [
                TranslateService
            ]
        };
    }
}
