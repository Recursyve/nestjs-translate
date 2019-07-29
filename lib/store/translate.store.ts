import { Injectable } from "@nestjs/common";

@Injectable()
export class TranslateStore {
    public defaultLang: string;
    public translations: { [lang: string]: unknown } = {};
}
