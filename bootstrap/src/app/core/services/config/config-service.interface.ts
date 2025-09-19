import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Configuration } from "./config.interface";

@Injectable()
export abstract class ConfigService {
  abstract config: Configuration;
  abstract isLoaded$: BehaviorSubject<boolean>;
  abstract loadConfig$(): Observable<boolean>;
  abstract getEndpoint(controller: string, path: string): string;
}
