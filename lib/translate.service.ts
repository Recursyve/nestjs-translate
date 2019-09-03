import { Inject, Injectable } from "@nestjs/common";
import { Observable } from "rxjs/internal/Observable";
import { of } from "rxjs/internal/observable/of";
import { share, take } from "rxjs/operators";
import { TranslateLoader } from "./loader/translate.loader";
import { TRANSLATE_OPTIONS, TranslateOptionsModel } from "./models/translate-options.model";
import { TranslateParser } from "./parser/translate.parser";
import { TranslateStore } from "./store/translate.store";

@Injectable()
export class TranslateService {
    private _translations: { [lang: string]: unknown } = {};
    private _langs: string[] = [];
    private loadingTranslations: Observable<any>;
    private pending = false;

    private set defaultLang(defaultLang: string) {
        if (!this.options.feature) {
            this.store.defaultLang = defaultLang;
        }
    }

    private get defaultLang(): string {
        return this.store.defaultLang;
    }

    private set translations(translations: { [lang: string]: unknown }) {
        if (this.options.feature) {
            this._translations = translations;
        } else {
            this.store.translations = translations;
        }
    }

    private get translations(): { [lang: string]: unknown } {
        return this.options.feature ? this._translations : this.store.translations;
    }

    private get langs(): string[] {
        return this.options.feature ? this._langs : this.store.langs;
    }

    private set langs(langs: string[]) {
        if (this.options.feature) {
            this._langs = langs;
        } else {
            this.store.langs = langs;
        }
    }

    constructor(
        @Inject(TRANSLATE_OPTIONS) private options: TranslateOptionsModel,
        private store: TranslateStore,
        private loader: TranslateLoader,
        private parser: TranslateParser
    ) {
        this.loadTranslations();
        this.defaultLang = this.options.defaultLang;
    }

    public get(key: string, params?: object): Observable<string>;
    public get(lang: string, key: string, params?: object): Observable<string>;
    public get(keyOrLang: string, paramsOrKey: string | object, params?: object): Observable<string> {
        let key: string;
        let lang: string;
        if (paramsOrKey && typeof paramsOrKey === "object" || !paramsOrKey) {
            params = paramsOrKey as object;
            key = keyOrLang;
            lang = this.defaultLang;
        } else {
            key = paramsOrKey as string;
            lang = keyOrLang as string;
        }

        if (!this.translations[lang]) {
            this.loadTranslations();
        }

        if (this.pending) {
            return new Observable(observer => {
                this.loadingTranslations.subscribe(() => {
                    observer.next(this.getTranslatedValue(lang, key, params));
                    observer.complete();
                }, error => {
                    observer.error(error);
                });
            });
        } else {
            return of(this.getTranslatedValue(lang, key, params));
        }
    }

    public instant(key: string, params?: object): string;
    public instant(lang: string, key: string, params?: object): string;
    public instant(keyOrLang: string, paramsOrKey: string | object, params?: object): string {
        let key: string;
        let lang: string;
        if (paramsOrKey && typeof paramsOrKey === "object" || !paramsOrKey) {
            params = paramsOrKey as object;
            key = keyOrLang;
            lang = this.defaultLang;
        } else {
            key = paramsOrKey as string;
            lang = keyOrLang as string;
        }

        if (!this.translations[lang]) {
            return keyOrLang;
        }

        return this.getTranslatedValue(lang, key, params);
    }

    private loadTranslations(): void {
        this.pending = true;
        this.loadingTranslations = this.loader.loadTranslations().pipe(share());
        this.loadingTranslations.pipe(take(1)).subscribe(value => {
            this.translations = value;
            this.updateLangs();
            this.pending = false;
        }, () => {
            this.pending = false;
        });
    }

    private getTranslatedValue(lang: string, key: string, params?: any): string {
        const translation = this.parser.interpolate(this.parser.getValue(this.translations[lang], key), params);
        if (translation !== key || !this.options.feature) {
            return translation;
        }

        return this.parser.interpolate(this.parser.getValue(this.store.translations[lang], key), params);
    }

    public addLangs(langs: Array<string>): void {
        langs.forEach((lang: string) => {
            if (this.langs.indexOf(lang) === -1) {
                this.langs.push(lang);
            }
        });
    }

    private updateLangs(): void {
        this.addLangs(Object.keys(this.translations));
    }
}
