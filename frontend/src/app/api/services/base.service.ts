import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '@app/core/services/config/config-service.interface';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseService {

  abstract _controllerName: string;

  constructor(
    protected http: HttpClient, 
    protected configService: ConfigService,
  ) { }

  getApiUrl(path: string): string {
    return this.configService.getEndpoint(this._controllerName, path);
  }
}