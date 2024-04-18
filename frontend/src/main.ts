import { AppComponent } from '@app/app.component';
import { APP_INITIALIZER } from '@angular/core';
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
  ]
})
  .catch(err => console.error(err));
