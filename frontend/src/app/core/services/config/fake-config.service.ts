import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ConfigService } from './config-service.interface';
import { Configuration } from './config.interface';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class FakeConfigService implements ConfigService {
  config: Configuration = {
    "baseUrl": "https://localhost:4200/api",
    "logLevel": "All"
  } as Configuration;
  isLoaded$!: BehaviorSubject<boolean>;

  loadConfig(): Observable<void> {
    return of();
  }

  getEndpoint(controller: string, path: string): string {
    return Location.joinWithSlash(Location.joinWithSlash(this.config.baseUrl, controller), path);
  }
}
