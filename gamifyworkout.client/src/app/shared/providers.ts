import { Provider } from "@angular/core";
import { ConfigService } from "@app/core/services/config/config-service.interface";
import { JsonConfigService } from "@app/core/services/config/json-config.service";

export function provideConfigService(): Provider {
  return {
    provide: ConfigService,
    useClass: JsonConfigService,
  };
}
