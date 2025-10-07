import { Provider } from "@angular/core";
import { HotToastService, provideHotToastConfig } from "@ngxpert/hot-toast";
import { ToastService } from "@app/core/services/toast/toast-service.interface";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { HttpConfigInterceptor } from "@app/core/interceptors/httpconfig.interceptor";

export function provideHttpInterceptor(): Provider {
  return {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpConfigInterceptor,
    multi: true
  }
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
