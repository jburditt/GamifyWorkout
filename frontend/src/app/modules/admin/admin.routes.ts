import { Route } from "@angular/router";
import { AuthGuard } from "@app/core/auth/auth.guard";
import { DashboardPageComponent } from "@app/modules/admin/pages/dashboard.component";

export class AdminRoutes {
  public static HOME = '';
  public static DENIED = 'denied';
}

export default [
  {
    path: AdminRoutes.HOME,
    component: DashboardPageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: AdminRoutes.DENIED,
    loadComponent: () => import('@app/modules/admin/pages/denied.component').then(m => m.DeniedPageComponent)
  }
] satisfies Route[];
