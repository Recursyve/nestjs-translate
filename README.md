# nestjs-translation

A i18n library for NestJs. 

**This library is work in progress** 

## Installation
```
npm install nestjs-translate --save
```

This library works only with Nest5

## Usage
#### 1. Import `TranslateModule`

The first step is to import the adding `TranslateModule.forRoot` in your AppModule. The `forRoot` function takes the path of the i18n files to load.

```typescript
@Module({
    imports: [
       TranslateModule.forRoot(__dirname + '/../assets/i18n')
    ]
})
export class ApplicationModule {
}
```

#### 2. Use the `TranslateService`

For the moment, the default language is set to en. You can overwrite the language when getting a translation.

```typescript
@Injectable()
export class HomeService {
    constructor(private translateService: TranslateService){}
    
    public defaultWelcomeMessage(lang: string) {
        return this.translateService.get('welcome');
    }
    
    public welcomeMessage(lang: string) {
        return this.translateService.get(lang, 'welcome');
    }
}

```
