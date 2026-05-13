import { TestBed } from '@angular/core/testing';
import { ApiAuthenticationService } from '@app/core/auth/api-auth.service';
import { TestProvider } from '@app/test-provider';
import { AuthService } from '@app/api/services/auth.service';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { User } from '@app/api/models';

describe('ApiAuthenticationService', () => {
  let service: ApiAuthenticationService;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['apiAuthWhoamiGet$Response']);

    TestBed.configureTestingModule({
      imports: [TestProvider],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        ApiAuthenticationService,
      ]
    });

    service = TestBed.inject(ApiAuthenticationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('isLoggedIn$ starts as false', () => {
    expect(service.isLoggedIn$.value).toBeFalse();
  });

  it('whoAmI returns the mapped API response', (done) => {
    const mockResponse = { body: { id: 'user-1', username: 'tester' } } as StrictHttpResponse<User>;
    authServiceSpy.apiAuthWhoamiGet$Response.and.returnValue(of(mockResponse));

    service.whoAmI({}).subscribe(response => {
      expect(response.body?.id).toBe('user-1');
      done();
    });
  });

  it('whoAmI propagates HTTP errors to the caller', (done) => {
    const mockError = new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' });
    authServiceSpy.apiAuthWhoamiGet$Response.and.returnValue(throwError(() => mockError));

    service.whoAmI({}).subscribe({
      error: (err: HttpErrorResponse) => {
        expect(err.status).toBe(401);
        done();
      }
    });
  });
});
