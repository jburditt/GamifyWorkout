import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject } from 'rxjs';
import { LoggingFactory, LoggingService, ConfigService } from 'fullswing-angular-library';

@Injectable({ providedIn: 'root' })
export class AzureOAuthService
{
  public isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public azureUserInfo: any = null;

  private readonly _loggingService: LoggingService;

  constructor(
    private readonly oauthService: OAuthService,
    private readonly loggingFactory: LoggingFactory,
    private readonly configService: ConfigService
  ) {
    this._loggingService = loggingFactory.create(this.constructor.name);
  }

  public init(): Promise<boolean> {
    let authConfig = this.configService.config['authentication'];
    authConfig.redirectUri = window.location.origin;
    this.oauthService.configure(authConfig);
    this.oauthService.timeoutFactor = 0.7;
    this.oauthService.setupAutomaticSilentRefresh();

    return this.oauthService
      .loadDiscoveryDocumentAndLogin()
      .then((isLoggedIn): Promise<boolean> => {
        if (isLoggedIn) {
          return this.oauthService.loadUserProfile().then((azureUserInfo: any): boolean => {
            this.azureUserInfo = azureUserInfo;
            // correct
            this._loggingService.debug('Azure User Info', this.azureUserInfo);
            this.isLoggedIn$.next(true);
            return true;
          });
        } else {
          // Pass in the original URL as additional state to the identity provider.  This information will be
          // returned once the user has been authenticated and will be used to redirect the user to the
          // originally requested URL.
          // DO NOT URL encode the state value as that happens automatically by the OAuthService.  Just convert
          // to base64.
          let encodedState = btoa(JSON.stringify({ originalURL: window.location.href }));
          this.oauthService.initCodeFlow(encodedState);
          return Promise.resolve(false);
        }
      })
      .catch((err) => {
        this._loggingService.error('OAuth Login Error', err);
        return Promise.resolve(false);
      });
  }

  public refresh(): void {
    this.oauthService.refreshToken();
  }

  public logout(): void {
    this.oauthService.logOut();
  }
}
