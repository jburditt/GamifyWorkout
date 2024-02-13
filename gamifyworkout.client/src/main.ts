import { AppComponent } from '@app/app.component';
import { APP_INITIALIZER } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ConfigService } from '@app/core/services/config/config-service.interface';
import { provideConfigService, provideLoggingService } from '@app/shared/providers';

export function initializeApp(configService: ConfigService/*, http: HttpClient, authService: AuthenticationService*/) {
  return (): Observable<void> => {
    return configService.loadConfig()
      //.pipe(tap(() => authService.init()))
      ;
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [ConfigService, HttpClient/*, AuthenticationService*/],
      multi: true,
    },
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    provideConfigService(),
    provideLoggingService(),
  ]
})
  .catch(err => console.error(err));
