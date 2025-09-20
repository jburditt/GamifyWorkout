import { Route } from "@angular/router";
import { GymPageComponent } from "@app/modules/inventory/pages/gym.component";
import { NgRxStoreComponent } from "@app/modules/feature/pages/ngrx-store.component";

export class FeatureRoutes {
  public static GYM = 'gym';
  public static ITEMS = 'items';
  public static EQUIPMENT = 'equipment';
}

export default [
  {
    path: FeatureRoutes.GYM,
    component: GymPageComponent,
  },
  // {
  //   path: FeatureRoutes.ITEMS,
  //   component: FormPageComponent,
  // },
  {
    path: FeatureRoutes.EQUIPMENT,
    component: NgRxStoreComponent,
  }
] satisfies Route[];
