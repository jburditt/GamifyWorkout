import { Provider } from "@angular/core";
import { ConfigService } from "@app/core/services/config/config-service.interface";
import { FakeConfigService } from "@app/core/services/config/fake-config.service";

export function provideFakes(): Provider {
  return {
    provide: ConfigService,
    useClass: FakeConfigService,
  };
}
