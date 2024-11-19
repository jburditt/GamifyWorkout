import { Route } from "@angular/router";
import { FormPageComponent } from "@app/modules/user/pages/form.component";
import { WeatherPageComponent } from "@app/modules/user/pages/weather.component";
import { DashboardPageComponent } from "./pages/dashboard.component";

export class UserRoutes {
  public static HOME = '';
  public static WEATHER = 'weather';
  public static DASHBOARD = 'dashboard';
}

export default [
  {
    path: UserRoutes.HOME,
    component: FormPageComponent,
  },
  {
    path: UserRoutes.WEATHER,
    component: WeatherPageComponent,
  },
  {
    path: UserRoutes.DASHBOARD,
    component: DashboardPageComponent,
  }
] satisfies Route[];
