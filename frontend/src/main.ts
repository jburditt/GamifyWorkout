import { AppComponent } from '@app/app.component';
import { APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { routes } from '@app/app.routes';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ConfigService } from '@app/core/services/config/config-service.interface';
import { provideConfigService, provideErrorHandler, provideHttpInterceptor, provideLoggingService, provideToastService } from '@app/shared/providers';
import { AuthService } from '@app/core/auth/auth.interface';
import { ApiAuthenticationService } from '@app/core/auth/auth.service';
import { provideOAuthService } from "@app/core/auth/auth.provider";

// ngrx/store
import { provideStore, provideState } from '@ngrx/store';
import { playerReducer } from "@features/rpg/store/player.reducer";

// TODO add @theme
import { TranslateService, TranslateStore, TranslateLoader, TranslateModule } from '@app/shared/template/node_modules/@ngx-translate/core';
import { TranslateHttpLoader } from '@app/shared/template/node_modules/@ngx-translate/http-loader';
// Required for AOT compilation
export function TranslateHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function initializeApp(configService: ConfigService, http: HttpClient, authService: AuthService) {
  return (): Observable<void> => {
    return configService.loadConfig()
      .pipe(tap(() => authService.init()));
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    {
        provide: APP_INITIALIZER,
        useFactory: initializeApp,
        deps: [ConfigService, HttpClient, AuthService],
        multi: true,
    },
    ApiAuthenticationService,
    provideOAuthService(),
    provideAnimations(),
    provideRouter(routes),
    provideErrorHandler(),
    provideHttpInterceptor(),
    provideHttpClient(withInterceptorsFromDi()),
    provideConfigService(),
    provideLoggingService(),
    provideToastService(),
    // ngrx/store
    provideStore(),
    provideState({ name: 'player', reducer: playerReducer }),
    // TODO
    TranslateService, TranslateStore,
    importProvidersFrom(TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: TranslateHttpLoaderFactory,
            deps: [HttpClient],
        },
    })),
    provideStore()
]
})
  .catch(err => console.error(err));
