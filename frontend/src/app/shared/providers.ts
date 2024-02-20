import { ErrorHandler, Provider } from "@angular/core";
import { ConfigService } from "@app/core/services/config/config-service.interface";
import { JsonConfigService } from "@app/core/services/config/json-config.service";
import { LoggingService } from "@app/core/services/logging/logging-service.interface";
import { LumberjackLoggingService } from "@app/core/services/logging/lumberjack-logging.service";
import { provideLumberjack } from "@ngworker/lumberjack";
import { provideLumberjackConsoleDriver } from "@ngworker/lumberjack/console-driver";
import { LoggingFactory } from "@app/core/services/logging/logging.factory";
import { HotToastService, provideHotToastConfig } from "@ngneat/hot-toast";
import { ToastService } from "@app/core/services/toast/toast-service.interface";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { ErrorHandlerService } from "@app/core/services/error-handler-service";
import { HttpConfigInterceptor } from "@app/core/interceptors/httpconfig.interceptor";
import { TokenInterceptor } from "@app/core/interceptors/token.interceptor";
import { AuthService } from "@app/core/auth/auth.interface";
import { AzureOAuthService } from "@app/core/auth/oauth.service";
import { provideOAuthClient } from "angular-oauth2-oidc";

export function provideHttpInterceptor(): Provider {
  return {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpConfigInterceptor,
    multi: true
  }
}

export function provideOAuthService(): any[] {
  return [{
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  },
  {
    provide: AuthService,
    useClass: AzureOAuthService
  },
  provideOAuthClient()];
}

export function provideErrorHandler(): Provider {
  return { provide: ErrorHandler, useClass: ErrorHandlerService };
}

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
