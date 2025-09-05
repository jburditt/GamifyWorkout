import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, throwError } from "rxjs";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ConfigService } from '@app/core/services/config/config-service.interface';
import { LoggingFactory } from '@app/core/services/logging/logging.factory';
import { LoggingService } from '@app/core/services/logging/logging-service.interface';
import { AuthService } from '@app/api/services/auth.service';
import { UserEntity } from '@app/api/models';

@Injectable()
export class ApiAuthenticationService
{
    public isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    private readonly _loggingService: LoggingService;

    constructor(
        private authService: AuthService,
        private router: Router,
        private loggingFactory: LoggingFactory
    ) {
        this._loggingService = loggingFactory.create(this.constructor.name);
    }

    whoAmI(azureUserInfo: any): Observable<any> {
        return this.authService.apiAuthWhoamiGet$Response().pipe(
            map((response: any) => {
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
