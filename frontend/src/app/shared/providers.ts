import { Provider } from "@angular/core";
import { HotToastService, provideHotToastConfig } from "@ngxpert/hot-toast";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { HttpConfigInterceptor } from "@app/core/interceptors/httpconfig.interceptor";

export function provideHttpInterceptor(): Provider {
  return {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpConfigInterceptor,
    multi: true
  }
}
