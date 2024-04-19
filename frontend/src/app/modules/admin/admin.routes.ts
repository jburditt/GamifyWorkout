import { Route } from "@angular/router";
import { WorkoutsPageComponent } from "@app/modules/admin/pages/workouts.component";
import { AdminLayoutComponent } from "@app/shared/template/app/theme/admin-layout/admin-layout.component";

export class AdminRoutes {
  public static HOME = '';
}

export default [
  {
    path: AdminRoutes.HOME,
    component: AdminLayoutComponent,
  }
] satisfies Route[];
