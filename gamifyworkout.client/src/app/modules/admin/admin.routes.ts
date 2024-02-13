import { Route } from "@angular/router";
import { WorkoutsPageComponent } from "@app/modules/admin/pages/workouts.component";

export class AdminRoutes {
  public static HOME = '';
}

export default [
  {
    path: AdminRoutes.HOME,
    component: WorkoutsPageComponent,
  }
] satisfies Route[];
