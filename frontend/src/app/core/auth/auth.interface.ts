import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export abstract class AuthService {
    abstract init(): void;
    abstract logout(): any;
    abstract isLoggedIn$: BehaviorSubject<boolean>;
}
