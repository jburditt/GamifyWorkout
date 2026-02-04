import { Route } from "@angular/router";
import { GymPageComponent } from "@app/modules/inventory/pages/gym.component";

export class FeatureRoutes {
  public static GYM = 'gym';
  public static ITEMS = 'items';
  public static EQUIPMENT = 'equipment';
}

export default [
  {
    path: FeatureRoutes.GYM,
    component: GymPageComponent,
  }
] satisfies Route[];
