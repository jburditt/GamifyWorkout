import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from "@fullswing-angular-library";
import { Observable, firstValueFrom, from, map, of, tap } from 'rxjs';
import { ConfigService } from '@fullswing-angular-library';

export const AuthGuard = (): Observable<any> => {
  //const router = inject(Router);
  //const authService = inject(AuthenticationService);
  //const configService = inject(ConfigService);

  // return authService.isLoggedIn$.pipe(
  //   map(async (isLoggedIn) => {
  //     console.log("AuthGuard isLoggedIn", isLoggedIn);
  //     if (!isLoggedIn) {
  //       // TODO check config is not already loaded
  //       return await firstValueFrom(configService.loadConfig$()).then(async () => {
  //         return await authService.init();
  //       });
  //       router.navigate(['/admin/denied']);
  //     }
  //     return isLoggedIn;
  //   }));
  return of(true);
};
