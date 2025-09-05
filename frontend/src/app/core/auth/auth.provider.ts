import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { TokenInterceptor } from "@app/core/auth/token.interceptor";
import { AuthenticationService } from "@app/core/auth/auth.interface";
import { AzureOAuthService } from "@app/core/auth/oauth.service";
import { provideOAuthClient } from "angular-oauth2-oidc";

export function provideOAuthService(): any[] {
    return [{
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: AuthenticationService,
      useClass: AzureOAuthService
    },
    provideOAuthClient()];
  }
