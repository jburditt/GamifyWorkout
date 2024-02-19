import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, throwError } from "rxjs";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ConfigService } from '@app/core/services/config/config-service.interface';
import { UserResponse } from '@app/api/models';
import { BaseService } from '@app/api/services/base.service';
import { LoggingFactory } from '@app/core/services/logging/logging.factory';
import { LoggingService } from '@app/core/services/logging/logging-service.interface';

@Injectable()
export class ApiAuthenticationService extends BaseService {

    public isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    readonly _controllerName = 'auth';
    private readonly _apiWhoAmIEndpoint = '/whoami';
    private readonly _loggingService: LoggingService;

    constructor(
        http: HttpClient,
        configService: ConfigService,
        private router: Router,
        private loggingFactory: LoggingFactory
    ) {
        super(http, configService);
        this._loggingService = loggingFactory.create(this.constructor.name);
    }

    whoAmI(azureUserInfo: any): Observable<any> {
		return this.http.get<UserResponse>(this.getApiUrl(this._apiWhoAmIEndpoint))
            .pipe(
                map((result: UserResponse) => {
                    this._loggingService.debug("azureUserInfo.info", azureUserInfo.info)
                    this._loggingService.debug("UserResponse result", result)
                    let userResponse = Object.assign(azureUserInfo.info, result);
                    // save userReponse to store
                    return result;
                }), catchError((error: HttpErrorResponse) => {
                    return throwError(() => error);
                })
            );
    }
}