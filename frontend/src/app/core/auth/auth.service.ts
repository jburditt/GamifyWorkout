import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, throwError } from "rxjs";
import { HttpErrorResponse } from '@angular/common/http';
import { LoggingFactory, LoggingService } from '@fullswing-angular-library';
import { AuthService } from '@app/api/services/auth.service';
import { User } from '@app/api/models';
import { StrictHttpResponse } from '@app/api/strict-http-response';

@Injectable()
export class ApiAuthenticationService
{
    public isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    private readonly _loggingService: LoggingService;

    constructor(
        private authService: AuthService,
        private loggingFactory: LoggingFactory
    ) {
        this._loggingService = loggingFactory.create(this.constructor.name);
    }

    whoAmI(azureUserInfo: any): Observable<StrictHttpResponse<User>> {
        return this.authService.apiAuthWhoamiGet$Response().pipe(
            map((response: StrictHttpResponse<User>) => {
                this._loggingService.debug("azureUserInfo.info", azureUserInfo.info);
                this._loggingService.debug("whoAmI response", response);
                return response;
            }),
            catchError((error: HttpErrorResponse) => {
                this._loggingService.error("whoAmI error", error);
                return throwError(() => error);
            })
        );
    }
}
