import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { LoggingFactory } from '@app/core/services/logging/logging.factory';
import { LoggingService } from '@app/core/services/logging/logging-service.interface';
import { AuthenticationService } from '@app/core/auth/auth.interface';
import { BehaviorSubject } from 'rxjs';
import { ConfigService } from '@fullswing-angular-library';
import { ApiAuthenticationService as AuthenticationApi } from '@app/core/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class AzureOAuthService implements AuthenticationService {

  public isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private readonly _loggingService: LoggingService;

  constructor(
    private readonly oauthService: OAuthService,
    private readonly loggingFactory: LoggingFactory,
    private readonly configService: ConfigService,
    private readonly authenticationApi: AuthenticationApi
  ) {
    this._loggingService = loggingFactory.create(this.constructor.name);
  }

  public init() {
    let authConfig = this.configService.config['authentication'];
    authConfig.redirectUri = window.location.origin;
    this.oauthService.configure(authConfig);

    this.oauthService.timeoutFactor = 0.7;
    this.oauthService.setupAutomaticSilentRefresh();

    this.oauthService
      .loadDiscoveryDocumentAndLogin()
      .then((isLoggedIn) => {
        if (isLoggedIn) {
          this.oauthService.loadUserProfile().then((azureUserInfo: any) => {
            this.isLoggedIn$.next(true);
            this.authenticationApi.whoAmI(azureUserInfo).subscribe({
              next: (_res: any) => {
                this.isLoggedIn$.next(true);
                // Retrieve the state information from the service.  This will contain the original URL
                // the user requested.  Redirect the user to that URL.
                // The state value is URL encoded by the OAuthService when it is sent to the identity
                // provided and therefore needs to be decoded before conversion from base64.
                let redirectState = JSON.parse(
                  this.oauthService.state ? atob(decodeURIComponent(this.oauthService.state)) : '{}'
                );
                if (redirectState.originalURL && redirectState.originalURL != window.location.href)
                  window.location.href = redirectState.originalURL;
              },
              error: (err: any) => {
                this._loggingService.error('OAuth Error', err);
                this.isLoggedIn$.next(false);
              },
            });
          });
        } else {
          // Pass in the original URL as additional state to the identity provider.  This information will be
          // returned once the user has been authenticated and will be used to redirect the user to the
          // originally requested URL.
          // DO NOT URL encode the state value as that happens automatically by the OAuthService.  Just convert
          // to base64.
          let encodedState = btoa(JSON.stringify({ originalURL: window.location.href }));
          this.oauthService.initCodeFlow(encodedState);
        }
      })
      .catch((err) => {
        this._loggingService.error('OAuth Login Error', err);
      });
  }

  refresh(): void {
    this.oauthService.refreshToken();
  }

  logout(): void {
    this.oauthService.logOut();
  }
}
