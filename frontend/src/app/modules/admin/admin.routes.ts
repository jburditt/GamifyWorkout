import { Route } from "@angular/router";
import { WorkoutsPageComponent } from "@app/modules/admin/pages/workouts.component";
//import { AdminLayoutComponent } from "@app/theme/admin-layout/admin-layout.component";

export class AdminRoutes {
  public static HOME = '';
}

export default [
  {
    path: AdminRoutes.HOME,
    component: WorkoutsPageComponent
  }
] satisfies Route[];
