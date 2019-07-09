import { Injectable } from "@nestjs/common";
import { Observable } from "rxjs/internal/Observable";
import { of } from "rxjs/internal/observable/of";
import { share, take } from "rxjs/operators";
import { TranslateLoader } from "./loader/translate.loader";
import { TranslateParser } from "./parser/translate.parser";

@Injectable()
export class TranslateService {
    private translations: any = {};
    private loadingTranslations: Observable<any>;
    private pending = false;
    private currentLang = "en";

    constructor(private loader: TranslateLoader, private parser: TranslateParser) {
    }

    public get(key: string, params?: object): Observable<string>;
    public get(lang: string, key: string, params?: object): Observable<string>;
    public get(keyOrLang: string, paramsOrKey: string | object, params?: object): Observable<string> {
        let key: string;
        let lang: string;
        if (paramsOrKey && typeof paramsOrKey === "object" || !paramsOrKey) {
            params = paramsOrKey as object;
            key = keyOrLang;
            lang = this.currentLang;
        } else {
            key = paramsOrKey as string;
            lang = keyOrLang as string;
        }

        if (!this.translations[lang]) {
            this.loadTranslation(lang);
        }

        if (this.pending) {
            return new Observable(observer => {
                this.loadingTranslations.subscribe(() => {
                    observer.next(this.getTranslatedValue(this.translations[lang], key, params));
                    observer.complete();
                }, error => {
                    observer.error(error);
                });
            });
        } else {
            return of(this.getTranslatedValue(this.translations[lang], key, params));
        }
    }

    private loadTranslation(lang: string): void {
        this.pending = true;
        this.loadingTranslations = this.loader.loadLang(lang).pipe(share());
        this.loadingTranslations.pipe(take(1)).subscribe(value => {
            this.translations[lang] = value;
            this.pending = false;
        }, () => {
            this.pending = false;
        });
    }

    private getTranslatedValue(translation: any, key: string, params?: any): string {
        return this.parser.interpolate(this.parser.getValue(translation, key), params);
    }
}
