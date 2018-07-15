import * as fs from 'fs';
import { NoLanguageFoundException } from "../exceptions/no-language-found.exception";
import { Observable } from "rxjs/internal/Observable";
import { Observer } from "rxjs/internal/types";

export class TranslateLoader {
    constructor(private prefix: string) {
    }

    public loadLang(lang: string): Observable<Object> {
        return Observable.create((observer: Observer<Object>) => {
            try {
                const values = fs.readFileSync(`${this.prefix}/${lang}.json`).toString();
                observer.next(JSON.parse(values));
                observer.complete();
            } catch (err) {
                if (err.code === "ENOENT") {
                    observer.error(new NoLanguageFoundException(lang, `${this.prefix}/${lang}.json`));
                } else {
                    observer.error(err);
                }
            }
        });
    }
}
