import { Injectable } from '@angular/core';

export enum LogLevel {
  All = 0,
  Debug = 1,
  Info = 2,
  Warn = 3,
  Error = 4,
  Fatal = 5,
  Off = 6
}

@Injectable()
export abstract class LoggingService {
  abstract scope?: string;
  abstract logLevel: LogLevel;
  abstract debug(message: string, payload?: any): void;
  abstract info(message: string, payload?: any): void;
  abstract warn(message: string, payload?: any): void;
  abstract error(message: string, payload?: any): void;
  abstract fatal(message: string, payload?: any): void;
}
