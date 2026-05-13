import { TestBed, fakeAsync, flushMicrotasks } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from '@app/core/auth/auth.guard';
import { AuthenticationService, ConfigService } from 'fullswing-angular-library';
import { BehaviorSubject, of } from 'rxjs';

describe('AuthGuard', () => {
  let isLoggedIn$: BehaviorSubject<boolean>;
  let authServiceMock: Partial<AuthenticationService>;
  let configServiceMock: Partial<ConfigService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    isLoggedIn$ = new BehaviorSubject<boolean>(false);
    authServiceMock = {
      isLoggedIn$,
      init: jasmine.createSpy('init').and.returnValue(Promise.resolve()),
    };
    configServiceMock = {
      loadConfig$: jasmine.createSpy('loadConfig$').and.returnValue(of(true)),
    };
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthenticationService, useValue: authServiceMock },
        { provide: ConfigService, useValue: configServiceMock },
        { provide: Router, useValue: routerSpy },
      ]
    });
  });

  it('emits true when the user is already logged in', (done) => {
    isLoggedIn$.next(true);

    TestBed.runInInjectionContext(() => {
      AuthGuard().subscribe(isLoggedIn => {
        expect(isLoggedIn).toBeTrue();
        done();
      });
    });
  });

  it('emits false when the user is not logged in', (done) => {
    isLoggedIn$.next(false);

    TestBed.runInInjectionContext(() => {
      AuthGuard().subscribe(isLoggedIn => {
        expect(isLoggedIn).toBeFalse();
        done();
      });
    });
  });

  it('triggers config load and auth init when the user is not logged in', fakeAsync(() => {
    isLoggedIn$.next(false);

    TestBed.runInInjectionContext(() => {
      AuthGuard().subscribe(() => {
        expect(configServiceMock.loadConfig$).toHaveBeenCalled();
      });
    });

    flushMicrotasks();
    expect(authServiceMock.init).toHaveBeenCalled();
  }));

  it('does not trigger auth init when the user is already logged in', (done) => {
    isLoggedIn$.next(true);

    TestBed.runInInjectionContext(() => {
      AuthGuard().subscribe(() => {
        expect(authServiceMock.init).not.toHaveBeenCalled();
        done();
      });
    });
  });
});
