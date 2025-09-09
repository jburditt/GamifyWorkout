import { Route } from "@angular/router";
import { DashboardPageComponent } from "@app/modules/admin/pages/dashboard.component";

export class AdminRoutes {
  public static HOME = '';
}

export default [
  {
    path: AdminRoutes.HOME,
    component: DashboardPageComponent
  }
] satisfies Route[];
