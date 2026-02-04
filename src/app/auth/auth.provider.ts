import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { TokenInterceptor } from "./token.interceptor";
import { AuthenticationService } from "./auth.interface";
import { AzureOAuthService } from "./oauth.service";
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
