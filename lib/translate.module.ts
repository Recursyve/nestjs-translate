import { Module } from "@nestjs/common";

@Module({})
export class TranslateModule {
    public static forRoot() {
        return {
            imports: [],
            providers: [],
            exports: []
        };
    }
}
