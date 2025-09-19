import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OAuthResourceServerErrorHandler, OAuthStorage } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
	constructor(
		private authStorage: OAuthStorage,
		private errorHandler: OAuthResourceServerErrorHandler
	) {}

	public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		let url = req.url.toLowerCase();

		// skip url does not start with /api/
		if (![/\/api\/.+$/].some((regexp) => regexp.test(url)))
			return next.handle(req);

    let token = this.authStorage.getItem('id_token');
		let header = 'Bearer ' + token;

		let headers = req.headers.set('Authorization', header);

		if (req.url.includes('api/claim-payments/')) {
			headers = headers.set('x-function-user', 'ProcessResult');
		}

		req = req.clone({ headers });

		return next.handle(req)
			.pipe(catchError((err) => this.errorHandler.handleError(err)));
	}
}
