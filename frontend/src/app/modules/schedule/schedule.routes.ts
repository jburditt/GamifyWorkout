import { Route } from "@angular/router";
import { WeekPageComponent } from "@app/modules/schedule/pages/week/week-page.component";

export class FeatureRoutes {
  public static WEEK = 'week';
}

export default [
  {
    path: FeatureRoutes.WEEK,
    component: WeekPageComponent,
  }
] satisfies Route[];
