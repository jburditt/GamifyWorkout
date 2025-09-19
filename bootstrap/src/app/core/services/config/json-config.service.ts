import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { ConfigService } from './config-service.interface';
import { Configuration } from './config.interface';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class JsonConfigService implements ConfigService {
  config!: Configuration;
  isLoaded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private readonly http: HttpClient) { }

  loadConfig$(): Observable<boolean> {
    return this.http.get('assets/config.json')
      .pipe(map((data: any) => {
        this.config = data;
        this.isLoaded$.next(true);
        return true;
      }), catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      }));
  }

  getEndpoint(controller: string, path: string): string {
    return Location.joinWithSlash(Location.joinWithSlash(this.config.baseUrl, controller), path);
  }
}
