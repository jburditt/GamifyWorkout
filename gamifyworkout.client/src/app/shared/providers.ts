// dependency injection wireup for services that can be changed or customized for different environments

import { Provider } from "@angular/core";
import { ConfigService } from "@app/core/services/config/config-service.interface";
import { JsonConfigService } from "@app/core/services/config/json-config.service";
import { LoggingService } from "@app/core/services/logging/logging-service.interface";
import { LumberjackLoggingService } from "@app/core/services/logging/lumberjack-logging.service";
import { provideLumberjack } from "@ngworker/lumberjack";
import { provideLumberjackConsoleDriver } from "@ngworker/lumberjack/console-driver";
import { LoggingFactory } from "@app/core/services/logging/logging.factory";
import { HotToastService, provideHotToastConfig } from "@ngneat/hot-toast";
import { ToastService } from "@app/core/services/toast/toast-service.interface";

export function provideConfigService(): Provider {
  return {
    provide: ConfigService,
    useClass: JsonConfigService,
  };
}

export function provideLoggingService(): Provider {
  return [
    {
      provide: LoggingService,
      useClass: LumberjackLoggingService
    },
    provideLumberjack(),
    provideLumberjackConsoleDriver(),
    LoggingFactory,
  ];
}

export function provideToastService(): Provider {
  return [
    provideHotToastConfig({
      position: 'top-center',
      dismissible: true
    }),
    {
      provide: ToastService,
      useClass: HotToastService
    }
  ];
};
