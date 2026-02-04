import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export abstract class AuthenticationService {
  abstract init(): Promise<boolean>;
  abstract logout(): any;
  abstract isLoggedIn$: BehaviorSubject<boolean>;
  abstract azureUserInfo: any;
}
