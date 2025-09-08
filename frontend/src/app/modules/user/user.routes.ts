import { Route } from "@angular/router";
import { FormPageComponent } from "@app/modules/user/pages/form.component";
import { DashboardPageComponent } from "./pages/dashboard.component";
import { SearchPageComponent } from "./pages/search.component";

export class UserRoutes {
  public static HOME = '';
  public static DASHBOARD = 'dashboard';
  public static SEARCH = 'search';
  public static EDIT = ':id';
}

export default [
  {
    path: UserRoutes.HOME,
    component: FormPageComponent,
  },
  {
    path: UserRoutes.DASHBOARD,
    component: DashboardPageComponent,
  },
  {
    path: UserRoutes.SEARCH,
    component: SearchPageComponent,
  },
  {
    path: UserRoutes.EDIT,
    component: FormPageComponent,
  }
] satisfies Route[];
