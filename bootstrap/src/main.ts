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
import { AuthenticationService } from '@app/core/auth/auth.interface';
import { ApiAuthenticationService } from '@app/core/auth/auth.service';
import { provideOAuthService } from "@app/core/auth/auth.provider";

import { NgxUiLoaderModule, NgxUiLoaderConfig, NgxUiLoaderRouterModule, NgxUiLoaderHttpModule } from 'ngx-ui-loader';
const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsColor: '#267591',
  bgsType: 'square-loader',
  bgsSize: 100
};

// ngrx/store
import { provideStore, provideState, StoreModule } from '@ngrx/store';
import { playerReducer } from "@features/rpg/store/player.reducer";
import { hydrationMetaReducer } from '@app/features/rpg/store/hydration.reducer';

// uncomment for site-wide authentication required
// export function initializeApp(configService: ConfigService, http: HttpClient, authService: AuthenticationService) {
//   return (): Observable<boolean> => {
//     return configService.loadConfig$()
//       .pipe(tap(() => authService.init()));
//   }
// }

bootstrapApplication(AppComponent, {
  providers: [
    // uncomment for site-wide authentication required
    // {
    //     provide: APP_INITIALIZER,
    //     useFactory: initializeApp,
    //     deps: [ConfigService, HttpClient, AuthenticationService],
    //     multi: true,
    // },
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
    importProvidersFrom(
      NgxUiLoaderHttpModule,
      NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
      NgxUiLoaderRouterModule.forRoot({ showForeground: false })
    ),
    // ngrx/store
    provideStore({ player: playerReducer }),
    provideState({ name: 'player', reducer: playerReducer }),
]
})
  .catch(err => console.error(err));
