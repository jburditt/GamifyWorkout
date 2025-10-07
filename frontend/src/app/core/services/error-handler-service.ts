import { ErrorHandler, Injectable } from '@angular/core';
import { LoggingFactory, LoggingService } from '@fullswing-angular-library';

@Injectable()
export class ErrorHandlerService extends ErrorHandler {

  private readonly _loggingService: LoggingService;

  constructor(
    private loggingFactory: LoggingFactory
  ) {
    super();

    this._loggingService = this.loggingFactory.create(this.constructor.name);
  }

  override handleError(error: any) {
    this._loggingService.error("ErrorHandler", error);
  }
}
