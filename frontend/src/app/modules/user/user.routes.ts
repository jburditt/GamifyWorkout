import { Route } from "@angular/router";
import { FormPageComponent } from "@app/modules/user/pages/form.component";
import { DashboardPageComponent } from "./pages/dashboard.component";

export class UserRoutes {
  public static HOME = '';
  public static DASHBOARD = 'dashboard';
}

export default [
  {
    path: UserRoutes.HOME,
    component: FormPageComponent,
  },
  {
    path: UserRoutes.DASHBOARD,
    component: DashboardPageComponent,
  }
] satisfies Route[];
