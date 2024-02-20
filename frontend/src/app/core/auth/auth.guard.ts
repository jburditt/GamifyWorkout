import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/core/auth/auth.interface';
import { Observable, map } from 'rxjs';

export const authGuard = (): Observable<boolean> => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.isLoggedIn$.pipe(
    map((isLoggedIn) => {
      if (!isLoggedIn)
        router.parseUrl('/denied');
      return isLoggedIn;
    }));
};