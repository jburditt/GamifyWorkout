import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export abstract class AuthenticationService {
    abstract init(): void;
    abstract logout(): any;
    abstract isLoggedIn$: BehaviorSubject<boolean>;
}
