import { Injectable } from "@nestjs/common";

export abstract class TranslateParser {

    /**
     * Get Gets a value from an object by composed key
     * @param data
     * @param {string} key
     * @example getValue({ key1: { keyA: "valueI" } }, "key1.keyA") => valueI
     */
    public abstract getValue(data: any, key: string): string;

    /**
     * Interpolates a string to replace parameters
     * @param {string} expr
     * @param params
     * @example interpolate("This is a {{ key }}", { key: "value" }) => This is a value
     */
    public abstract interpolate(expr: string, params?: any): string;
}

@Injectable()
export class DefaultTranslationParser extends TranslateParser {
    private templateMatcher: RegExp = /{{\s?([^{}\s]*)\s?}}/g;

    public getValue(data: any, key: string): string {
        const keys: string[] = key.split(".");

        do {
            const k = keys.shift() as string;
            if (!data || !data.hasOwnProperty(k)) {
                return key;
            }

            if (typeof data[k] === "object" || !keys.length) {
                data = data[k];
            }
        } while (keys.length);

        return data;
    }

    public interpolate(expr: string, params?: any): string {
        if (!params) {
            return expr;
        }

        return expr.replace(this.templateMatcher, (substring: string, b: string) => {
            const param = this.getValue(params, b);
            return param ? param : substring;
        });
    }
}
