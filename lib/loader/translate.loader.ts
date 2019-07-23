import * as fs from "fs";
import { from } from "rxjs";
import { Observable } from "rxjs/internal/Observable";
import { map } from "rxjs/operators";
import { promisify } from "util";

export class TranslateLoader {
    constructor(private prefix: string) {
    }

    public loadTranslations(): Observable<object> {
        return from(promisify(fs.readdir)(this.prefix)).pipe(
            map((files: string[]) => {
                const translations = {};
                for (const file of files) {
                    if (!file.endsWith(".json")) {
                        continue;
                    }

                    const lang = file.replace(".json", "");
                    translations[lang] = this.loadLang(lang);
                }
                return translations;
            })
        );

    }

    private loadLang(lang: string): object {
        const values = fs.readFileSync(`${this.prefix}/${lang}.json`).toString();
        return JSON.parse(values);
    }
}
