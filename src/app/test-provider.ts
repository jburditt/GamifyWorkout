import { NgModule, Provider } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideOAuthService, provideConfigService, provideLoggingService, provideErrorHandler, provideHttpInterceptor, provideToastService, AuthenticationService } from "fullswing-angular-library";

@NgModule({
  //imports: [CommonModule],
  providers: [
    provideHttpClient(),
    //provideHttpClientTesting(), // Use mock backend for all tests
    provideOAuthService(),
    provideConfigService(),
    provideLoggingService(),
    provideErrorHandler(),
    provideHttpInterceptor(),
    provideToastService(),
  ]
})
export class TestProvider {}
