import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/core/auth/auth.interface';
import { Observable, map, of, tap } from 'rxjs';
import { ConfigService } from '../services/config/config-service.interface';

export const AuthGuard = (): Observable<boolean> => {
  const router = inject(Router);
  const authService = inject(AuthenticationService);
  const configService = inject(ConfigService);

  return authService.isLoggedIn$.pipe(
    map((isLoggedIn) => {
      if (!isLoggedIn) {
        // TODO check config is not already loaded
        configService.loadConfig$().subscribe(() => {
          authService.init();
        });
        router.navigate(['/admin/denied']);
      }
      return isLoggedIn;
    }));
};
