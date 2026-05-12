import { Route } from "@angular/router";
import { WeekPageComponent } from "@app/modules/schedule/pages/week/week-page.component";
import { TodayScheduleComponent } from "@app/modules/schedule/pages/today/today-schedule.component";

export class FeatureRoutes {
  public static WEEK = 'week';
  public static TODAY = 'today';
}

export default [
  {
    path: FeatureRoutes.WEEK,
    component: WeekPageComponent,
  },
  {
    path: FeatureRoutes.TODAY,
    component: TodayScheduleComponent,
  }
] satisfies Route[];
