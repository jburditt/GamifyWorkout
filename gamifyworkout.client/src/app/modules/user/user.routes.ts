import { Route } from "@angular/router";
import { FormPageComponent } from "@app/modules/user/pages/form.component";

export class UserRoutes {
  public static HOME = '';
}

export default [
  {
    path: UserRoutes.HOME,
    component: FormPageComponent,
  }
] satisfies Route[];
