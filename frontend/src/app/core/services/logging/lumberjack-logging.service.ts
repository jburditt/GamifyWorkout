import { LumberjackService, LumberjackLevel, LumberjackTimeService, provideLumberjack } from '@ngworker/lumberjack';
import { Injectable } from '@angular/core';
import { LogLevel, LoggingService } from './logging-service.interface';

@Injectable()
export class LumberjackLoggingService implements LoggingService {
  constructor(
    private readonly lumberjackService: LumberjackService,
    private lumberjackTimeService: LumberjackTimeService
  ) { }

  scope?: string;
  logLevel: LogLevel = LogLevel.All;

  debug(message: string, payload?: any) {
    if (this.logLevel <= LogLevel.Debug)
      this.writeToLog(LogLevel.Debug, message, payload);
  }

  info(message: string, payload?: any) {
    if (this.logLevel <= LogLevel.Info)
      this.writeToLog(LogLevel.Info, message, payload);
  }

  warn(message: string, payload?: any) {
    if (this.logLevel <= LogLevel.Warn)
      this.writeToLog(LogLevel.Warn, message, payload);
  }

  error(message: string, payload?: any) {
    if (this.logLevel <= LogLevel.Error)
      this.writeToLog(LogLevel.Error, message, payload);
  }

  fatal(message: string, payload?: any) {
    if (this.logLevel <= LogLevel.Fatal)
      this.writeToLog(LogLevel.Fatal, message, payload);
  }

  private writeToLog(logLevel: LogLevel, message: string, payload?: any) {
    let lumberjackLevel: LumberjackLevel = 'debug';
    switch (logLevel) {
      case LogLevel.Debug:
        lumberjackLevel = 'debug';
        break;
      case LogLevel.Info:
        lumberjackLevel = 'info';
        break;
      case LogLevel.Warn:
        lumberjackLevel = 'warn';
        break;
      case LogLevel.Error:
        lumberjackLevel = 'error';
        break;
      case LogLevel.Fatal, LogLevel.Off:
        lumberjackLevel = 'critical';
        break;
    }

    this.lumberjackService.log({
      level: lumberjackLevel,
      message: message,
      payload: payload,
      scope: this.scope,
      createdAt: this.lumberjackTimeService.getUnixEpochTicks(),
    });
  }
}
