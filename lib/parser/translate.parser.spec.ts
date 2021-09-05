import { DefaultTranslationParser, TranslateParser } from "./translate.parser";

const values = {
    simple: "Simple value",
    nested: {
        value: "Nested value"
    },
    interpolation: "Its an interpolation {{ value }}",
    interpolations: {
        test0: "Its an interpolation {{value }}",
        test1: "Its an interpolation {{ value}}",
        test2: "Its an interpolation {{value}}"
    }
};

describe("TranslateParser", () => {
    let parser: TranslateParser;
    beforeAll(() => {
        parser = new DefaultTranslationParser();
    });

    it("getValue should return the value associate to a key", () => {
        const value = parser.getValue(values, "simple");
        expect(value).toBe("Simple value");
    });

    it("getValue should return the value associate to a key chain", async () => {
        const value = parser.getValue(values, "nested.value");
        expect(value).toBe("Nested value");
    });

    it("getValue should return the key if no data is found with the given key", async () => {
        const value = parser.getValue(values, "unknown.key");
        expect(value).toBe("unknown.key");
    });

    describe("interpolate should return the string with the param in it", () => {
        it("with {{ value }}", () => {
            let value = parser.getValue(values, "interpolation");
            value = parser.interpolate(value, {
                value: "example"
            });
            expect(value).toBe("Its an interpolation example")
        });

        it("with {{value }}", () => {
            let value = parser.getValue(values, "interpolations.test0");
            value = parser.interpolate(value, {
                value: "example"
            });
            expect(value).toBe("Its an interpolation example")
        });

        it("with {{ value}}", () => {
            let value = parser.getValue(values, "interpolations.test1");
            value = parser.interpolate(value, {
                value: "example"
            });
            expect(value).toBe("Its an interpolation example")
        });

        it("with {{value}}", () => {
            let value = parser.getValue(values, "interpolations.test2");
            value = parser.interpolate(value, {
                value: "example"
            });
            expect(value).toBe("Its an interpolation example")
        });
    });
});
