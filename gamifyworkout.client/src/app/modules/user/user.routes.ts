import { Route } from "@angular/router";
import { FormPageComponent } from "@app/modules/user/pages/form.component";
import { WeatherPageComponent } from "@app/modules/user/pages/weather.component";

export class UserRoutes {
  public static HOME = '';
  public static WEATHER = 'weather';
}

export default [
  {
    path: UserRoutes.HOME,
    component: FormPageComponent,
  },
  {
    path: UserRoutes.WEATHER,
    component: WeatherPageComponent,
  }
] satisfies Route[];
